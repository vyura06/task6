"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const json2csv = require("json2csv");
const { setSeed, setLocale, getNextPage, setErrors } = require("./faker");

const PORT = process.env.PORT || 8000;
let fakeData = [];

const parser = new json2csv.Parser({ delimiter: ";" });

const mimeLookup = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
};

const staticLocation = "./client/";
const getFileUrl = url => (url === "/" ? "index.html" : url);
const getFilePath = fileUrl => path.resolve(staticLocation + fileUrl);

const getNewPage = url => {
  const myURL = new URL(url, "http://sample.url/");

  const page = +myURL.searchParams.get("page");
  const seed = +myURL.searchParams.get("seed");
  const locale = myURL.searchParams.get("locale");
  const errors = +myURL.searchParams.get("errors");

  setLocale(locale);
  setSeed(page + seed);
  setErrors(errors);

  if (page === 1)
    fakeData = [];

  const data = getNextPage(page);
  fakeData = fakeData.concat(data);

  return data;
};

const server = http.createServer((req, res) => {
  if (req.method === "GET") {
    if (req.url.startsWith("/data?")) {
      const response = getNewPage(req.url);
      res.end(JSON.stringify(response));
      return;
    } 

    const filePath = getFilePath(getFileUrl(req.url));
    const mimeType = mimeLookup[path.extname(filePath)];

    if (!mimeType) return;

    res.writeHead(200, { "Content-Type": mimeType });
    fs.createReadStream(filePath).pipe(res);
  }
});

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
