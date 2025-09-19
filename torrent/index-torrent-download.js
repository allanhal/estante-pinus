// const TorrentSearchApi = require('torrent-search-api');
// import TorrentSearchApi from "torrent-search-api";

// import RutrackerAPI from "rutracker-api";

// TorrentSearchApi.enableProvider("1337x");
// // '1337x',
// TorrentSearchApi.enableProvider("Eztv");
// // 'Eztv',
// TorrentSearchApi.enableProvider("IpTorrents");
// // 'IpTorrents';
// TorrentSearchApi.enableProvider("KickassTorrents");
// // 'KickassTorrents',
// TorrentSearchApi.enableProvider("Limetorrents");
// // 'Limetorrents',
// TorrentSearchApi.enableProvider("Rarbg");
// // 'Rarbg',
// TorrentSearchApi.enableProvider("ThePirateBay");
// // 'ThePirateBay',
// TorrentSearchApi.enableProvider("Torrent9");
// // 'Torrent9',
// TorrentSearchApi.enableProvider("TorrentLeech");
// // 'TorrentLeech',
// TorrentSearchApi.enableProvider("TorrentProject");
// // 'TorrentProject',
// TorrentSearchApi.enableProvider("Torrentz2");
// // 'Torrentz2',
// TorrentSearchApi.enableProvider("Yggtorrent");
// // 'Yggtorrent',
// TorrentSearchApi.enableProvider("Yts");
// // 'Yts'

// const providers = TorrentSearchApi.getProviders()
//   .filter((p) => p.public)
//   .map((p) => p.name);
// const activeProviders = TorrentSearchApi.getActiveProviders();
// console.log({ providers, activeProviders });

// for (const provider of providers) {
//   if (["ThePirateBay"].includes(provider)) continue;
//   //   TorrentSearchApi.enableProvider(provider);
// }
// TorrentSearchApi.enableProvider("1337x");

// console.log(
//   await TorrentSearchApi.search("god of war Ragnarok portable", "Games", 3)
// );

// const RutrackerApi = require("rutracker-api");
// import RutrackerApi from 'rutracker-api';
// const rutracker = new RutrackerApi();

// rutracker
//   .login({ username: "torrent-user-api", password: "FB43yCk%m#7^6z" })
//   .then(() => {
//     console.log("Authorized");
//   })
//   .catch((err) => console.error(err));

import fs from "fs";
import RutrackerApi from "rutracker-api-with-proxy";
import WebTorrent from "webtorrent-hybrid";
import dotenv from "dotenv";
dotenv.config();

async function downloadTorrent() {
  const rutracker = new RutrackerApi();

  try {
    // Login
    await rutracker.login({
      username: process.env.RUTRACKER_USERNAME,
      password: process.env.RUTRACKER_PASSWORD,
    });

    // Search
    const torrents = await rutracker.search({
      // query: "god of war portable",
      query: "precinct portable",
      sort: "seeds", // options: "registered", "title", "downloads", "size", "lastMessage", "seeds", "leeches"
    });

    console.log(torrents[0]?.id);
    console.log(torrents[1]?.id);

    // Download
    const stream = await rutracker.download(torrents[0]?.id);
    stream.pipe(fs.createWriteStream("filename.torrent"));

    stream.on("finish", () => {
      const client = new WebTorrent();

      // Magnet URI or path to .torrent file
      // const torrentId = 'magnet:?xt=urn:btih:...'; // replace with your magnet or './file.torrent'
      const torrentId = "./filename.torrent"; // replace with your magnet or './file.torrent'
      const downloadPath = "./downloads";

      client.add(torrentId, { path: downloadPath }, (torrent) => {
        console.log("Torrent metadata fetched:", torrent.name);

        // List files
        torrent.files.forEach((file) =>
          console.log("  -", file.name, file.length)
        );

        // Example: stream first file to stdout
        const file = torrent.files[0];
        const stream = file.createReadStream();
        stream.on("data", (chunk) => {
          process.stdout.write(chunk); // or pipe to an HTTP response
        });

        torrent.on("done", () => {
          console.log("Download finished — all files are in", downloadPath);
          client.destroy();
        });

        // Optional: monitor progress
        const progressInterval = setInterval(() => {
          const progress = (torrent.progress * 100).toFixed(2);
          console.log(
            `${progress}% — ${client.downloadSpeed}/s down, ${client.uploadSpeed}/s up`
          );
        }, 1500);

        torrent.on("done", () => clearInterval(progressInterval));
      });
    });

    stream.on("error", (err) => {
      console.error("Error writing file:", err);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

downloadTorrent();
