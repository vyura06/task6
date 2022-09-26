"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const json2csv = require("json2csv");
const { setSeed, setLocale, getNextPage, setErrors } = require("./fake-data");

const PORT = process.env.PORT || 8000;
let fakeData = [];

const parser = new json2csv.Parser({ delimiter: ";" });

const mimeLookup = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
};



server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
