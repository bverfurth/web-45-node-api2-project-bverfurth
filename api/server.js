// implement your server here
// require your posts router and connect it here
const express = require("express");
const postsRouter = require("./posts/posts-router");

// Invoking Express
const server = express();

//Teach Express how to parse JSON bodies
server.use(express.json());

server.use("/api/posts", postsRouter);

// Catch All Endpoint
server.use("*", (req, res) => {
  res.status(404).json({
    message: "not found",
  });
});

module.exports = server;
