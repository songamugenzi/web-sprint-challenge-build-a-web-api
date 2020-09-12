const express = require("express");
const helmet = require("helmet");

const apiRouter = require("./api-router.js");

const server = express();
server.use(express.json());
server.use(helmet());
server.use(logger);

server.use("/api", apiRouter);

function logger(req, res, next) {
  const method = req.method;
  const url = req.url;
  const timestamp = new Date().toISOString();
  next();
}

module.exports = server;
