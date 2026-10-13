# `/loja` — E-commerce Store (single Vite app + Vercel functions)

> **Status: implemented.** The store lives in the SAME Vite + React SPA as the
> configurators, with a small serverless API under `api/`. There is no second
> app, no Next.js and no Vercel Microfrontends (all removed on 2026-10-13).

## 0. Decisions (locked)
| Topic | Choice |
|---|---|
| Architecture | ONE Vite SPA (react-router) + Vercel Node functions in `api/` |
| Store scope | Pre-made fixed-size versions of Estante, Estante Reforçada, Mão Francesa, Prateleira (not Luminária) |
| Cart | Multi-item, `localStorage` (`loja-cart-v1`), one PIX charge per order |
| Payments | PIX only, pague.dev **v2** |
| Orders | Neon Postgres; short 8-char code (`23456789A-Z` minus I,L,O) is the public order id |
| Checkout collects | name, email, phone, CPF, CEP + address (ViaCEP autofill) |
| Prices | Single source of truth: `src/pricing.js` → `src/loja/catalog.js`; the server recomputes totals, client prices are ignored |
| Git identity | commit/push as `allanhal <allan.hal@gmail.com>` |

## Env (root `.env` locally; Vercel Project Settings in prod) — all server-side, never `VITE_`-prefixed
| Var | Notes |
|---|---|
| `NEON_URL` | Postgres connection string (DB already migrated) |
| `PAGUEDEV_CLIENT_ID` / `PAGUEDEV_CLIENT_SECRET` | v2 creds (`mp_test_…` / `mp_live_…`). Absent => mock PIX in dev, error in prod |
| `PAGUEDEV_WEBHOOK_SECRET` | HMAC key for `X-Pague-Signature` |
| `LOJA_ADMIN_PASSWORD` | `/loja/admin` password |
| `LOJA_SESSION_SECRET` | signs the admin cookie |
| `LOJA_PIX_MOCK=1` | dev only; ignored when `NODE_ENV=production` or on Vercel |
| `PAGUEDEV_API_URL` | optional base-URL override |

## 1. pague.dev integration reference (authoritative - v2 API)

> The v1 API (`api.pague.dev`, `X-API-Key`, `pd_test_` keys) is **dead** (NXDOMAIN) -
> do not use it. The live API is v2 at `api-gateway.pague.dev`. All calls are
> server-side only (Vercel functions in `api/`). `PAGUEDEV_API_URL` overrides the base.

Base: **`https://api-gateway.pague.dev/v2`**. Creds: `PAGUEDEV_CLIENT_ID` /
`PAGUEDEV_CLIENT_SECRET` (`mp_test_...` / `mp_live_...`) and `PAGUEDEV_WEBHOOK_SECRET`.

### 1.1 Get access token
```
POST /v2/auth     { "client_id": "...", "client_secret": "..." }
-> 200 { "access_token": "<jwt>", "token_type": "Bearer", "expires_in": 300 }
```
Cache in memory; re-fetch when <30s remain.

### 1.2 Create PIX charge
```
POST /v2/pix
Authorization: Bearer <token>
Content-Type: application/json
Idempotency-Key: <uuid>          # per order; same key -> cached response 24h
{ "amount": 123.45,              # BRL number, min 1
  "description": "Pedido #... - Estante Pinus",   # max 255
  "customer": { "name", "document": "<cpf digits>", "email", "phone" },   # optional
  "externalReference": "<our order id>",
  "expiresIn": 3600,
  "metadata": { "orderId": "<id>" } }
-> 201 { id, status (pending|completed|failed|cancelled), amount, currency,
         pixCopyPaste, qrCodeBase64?, expiresAt, createdAt }
```

### 1.3 Look up a transaction (status poll)
```
GET /v2/transactions/{id}      Authorization: Bearer <token>
# {id} = charge id OR our externalReference OR the Idempotency-Key
-> 200 { id, status, paymentMethod, paidAt, ... }      # completed => paid
```
Used by `api/orders/[id]/status.js` (works without a public webhook URL).

### 1.4 Webhooks (production confirmation path)
- Events: `payment_completed`, `payment_expired`, `payment_failed`, `refund_completed`, ...
- Payload: `{ event, eventId, timestamp, data: { transactionId, status, amount,
  externalReference, metadata, ... } }`. We handle `payment_completed`; the order is
  matched by `data.externalReference` / `data.transactionId`.
- Verify every request: header `X-Pague-Signature: sha256=<hex HMAC-SHA256 of the raw
  body>`, key = `PAGUEDEV_WEBHOOK_SECRET` used directly (not hashed); compare with
  `crypto.timingSafeEqual`. Other headers: `X-Pague-Event`, `X-Pague-Webhook-ID`,
  `X-Pague-Timestamp`. Read the raw body (the raw request stream).
- Dedupe on `eventId` (`webhook_events` table).
- Endpoint secret is shown once in the pague.dev dashboard (see §8).

---

## 2. Architecture & data flow

```
Browser (Vite SPA)                                  Vercel
  /, /estante-reforcada, /mao-francesa, ...   -->   static index.html (SPA rewrite)
  /loja, /loja/produto/:slug, /loja/carrinho,
  /loja/checkout, /loja/pedido/:code, /loja/admin
  fetch('/api/...')                           -->   api/*.js  (Node functions)
                                                      |-- Neon Postgres (orders, webhook_events)
                                                      '-- pague.dev v2
```

**Checkout flow**
1. Cart (localStorage) -> `/loja/checkout` form.
2. `POST /api/orders` `{items:[{sku,qty}], customer, address}`: validate, recompute total from `src/loja/catalog.js`, insert order (`pending`, short `code`), create the PIX charge (`externalReference = code`), persist pix fields, return `{code,total,pixCopyPaste,qrCodeBase64,expiresAt}`.
3. UI shows the QR (provider `qrCodeBase64`, else generated locally from the copia-e-cola with the `qrcode` package) + copia-e-cola, and polls `GET /api/orders/:code/status` every 4s (that endpoint asks pague.dev `GET /v2/transactions/{id}` and marks the order paid).
4. In production pague.dev also calls `POST /api/webhooks/paguedev` (signature verified, deduped on `eventId`). Poll and webhook are both idempotent.
5. `/loja/admin` (password) lists orders via `GET /api/orders` (signed httpOnly cookie).

## 3. File layout
```
api/
  _lib/{db,http,auth,orders,paguedev,pix}.js   # shared server code (underscore dir = not routed)
  orders/index.js            # POST create order+PIX ; GET list (admin)
  orders/[id]/status.js      # GET status by short code (polls pague.dev)
  webhooks/paguedev.js       # POST signed webhook (raw body)
  admin/{login,logout}.js    # POST ; sets/clears cookie `loja_admin`
scripts/{schema.sql,migrate.mjs,test-pague.mjs}
src/pricing.js               # PURE price/BOM formulas + constants (client AND api import it)
src/App.jsx                  # configurator; re-exports pricing symbols for existing importers
src/loja/{catalog.js,StoreLayout,Home,Product,Cart,Checkout,PixPayment,Order,Admin,ProductCard}.jsx|js
src/ProductTabs.jsx          # top nav, includes "Loja"
vercel.json                  # SPA rewrite excluding /api
```
`package.json` has `"type": "module"` so `api/*.js` are ESM. `src/pricing.js`,
`src/ripa.js` and `src/loja/catalog.js` must stay free of React/three/DOM/asset
imports (they run in Node). Product images are keys (`bg`, `orange`) mapped to
`src/assets/*` in `src/loja/images.js`.

## 4. Catalog (`src/loja/catalog.js`)
12 placeholder SKUs generated from the configurator formulas (so prices follow
`src/pricing.js`). Each has `slug, category, name, dimensions, dimensionsLabel,
price, description, image, customizeHref` (deep link back to the configurator,
"Personalizar" button on the PDP). `// TODO(owner)`: real SKUs/photos/shipping
(`SHIPPING_FLAT = 0`).

## 5. Vercel routing
```json
{ "rewrites": [{ "source": "/((?!api/).*)", "destination": "/index.html" }] }
```
`/api/*` reaches the functions; every other path falls back to the SPA.

## 6. Database
`pnpm migrate` applies `scripts/schema.sql` (idempotent: `orders` incl. `code`
unique, `webhook_events`). The Neon DB is already migrated.

## 7. Local development & verification
- `pnpm dev` — UI only (Vite does NOT serve `/api`).
- `vercel dev` — UI + `/api` together (project must be linked; uses `.env`; with no pague.dev creds and `LOJA_PIX_MOCK=1` you get a mock PIX).
- `pnpm build` — production build of the SPA.
- `pnpm test:pague` — live v2 smoke test (auth, R$1 charge, lookup); needs v2 creds.
- Mock status never turns `paid` by polling; simulate payment by sending a webhook signed with `PAGUEDEV_WEBHOOK_SECRET`:
  `body='{"event":"payment_completed","eventId":"e1","data":{"externalReference":"<CODE>"}}'; sig=$(printf %s "$body" | openssl dgst -sha256 -hmac "$PAGUEDEV_WEBHOOK_SECRET" | awk '{print $2}'); curl -X POST localhost:3000/api/webhooks/paguedev -H "x-pague-signature: sha256=$sig" -d "$body"`

## 8. Go-live checklist (manual)
1. Vercel project `estante-pinus`: set env vars from the table above (no mock).
2. Add v2 `PAGUEDEV_CLIENT_ID/SECRET` (sandbox first), run `pnpm test:pague`.
3. In the pague.dev dashboard register the webhook `https://<domain>/api/webhooks/paguedev` for `payment_completed` and copy its secret into `PAGUEDEV_WEBHOOK_SECRET`.
4. Deploy; place a R$1 order end to end; confirm it shows as paid in `/loja/admin`.
5. Replace placeholder catalog content; define real shipping.
