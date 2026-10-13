create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'pending',
  items jsonb not null,
  subtotal numeric(10,2) not null,
  shipping numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  customer jsonb not null,
  address jsonb,
  pix_charge_id text,
  pix_copy_paste text,
  pix_qr_base64 text,
  external_reference text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_status_idx on orders(status);
create index if not exists orders_charge_idx on orders(pix_charge_id);
create table if not exists webhook_events (
  event_id text primary key,
  received_at timestamptz not null default now()
);

-- short user-facing order reference (8 chars, unambiguous uppercase alphabet)
alter table orders add column if not exists code text;
create unique index if not exists orders_code_key on orders(code);
