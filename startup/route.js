const cors = require("cors");
const express = require("express");
const users = require("../routes/user");
const categories = require("../routes/category");
const products = require("../routes/product");
const reviews = require("../routes/review");
const error = require("../middlewares/error");

module.exports = function(app) {
  app.use(express.json({ limit: "50mb" }));
  app.use(cors());
  app.use(express.static("./public/assets"));
  app.use("/users", users);
  app.use("/categories", categories);
  app.use("/products", products);
  app.use("/reviews", reviews);
  app.use(error);
};
