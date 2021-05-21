const { Bag } = require("../models/bag");
const _ = require("lodash");
const fs = require("fs");

exports.createBag = async (req, res, next) => {
  if (error) return res.status(400).send(error.details[0].message);
  const { email, products } = req.body;
  bag = new Bag({
    email,
    products,
  });
  try {
    await bag.save();
    const token = bag.generateAuthToken();
    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send(_.pick(bag, ["product", "email"]));
  } catch (ex) {
    next(ex);
  }
};

exports.editBag = async (req, res, next) => {
  const { email, products } = req.body;
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Invalid product");
    const updateBody =
      req.files.length !== 0
        ? {
            price,
            trailer,
            numberInstore,
            stars,
            poster: req.files[0].filename,
            thumbnail: req.files[1].filename,
          }
        : {
            price,
            trailer,
            numberInstore,
            stars,
            thumbnail: product.thumbnail,
            poster: product.poster,
          };
    product = await Product.findByIdAndUpdate(req.params.id, updateBody, {
      new: true,
    });
    res.send(_.pick(product, ["title", "storyline", "author", "price"]));
  } catch (ex) {
    next(ex);
  }
};

exports.deleteBag = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndRemove(req.params.id);
    if (!product) return res.status(404).send("Invalid product");
    res.send("Product is deleted");
  } catch (ex) {
    next(ex);
  }
};

exports.getAllBag = async (req, res, next) => {
  try {
    const products = await Product.find().sort("title").populate("category");
    res.send(products);
  } catch (ex) {
    next(ex);
  }
};

exports.getBagDetail = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) return res.status(404).send("Invalid product");
    res.send(product);
  } catch (ex) {
    next(ex);
  }
};

exports.searchBag = async (req, res, next) => {
  try {
    const { title } = req.query;
    const query = ".*" + title + ".*";
    const products = await Product.find({
      title: { $regex: new RegExp(query), $options: "i" },
    }).populate("category");
    res.send(products);
  } catch (ex) {
    next(ex);
  }
};
