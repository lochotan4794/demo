const { Product, validProduct } = require("../models/product");
const upload = require("../middlewares/upload");
const _ = require("lodash");
const fs = require("fs");

exports.createProduct = (req, res, next) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      res.status(400).send("Error while uploading images");
    } else {
      const { productName, category, price, description } = req.body;
      // const { error } = validProduct(req.body);
      // console.log(error);
      // if (error) return res.status(400).send(error.details[0].message);
      const body =
        req.file
          ? {
              productName,
              category,
              price,
              description,
              image: req.file.filename,
            }
          : {
              productName,
              category,
              price,
              description,
            };
      let product = new Product(body);
      try {
        await product.save();
        res.send(
          _.pick(product, ["productName", "category", "price", "description"])
        );
      } catch (ex) {
        next(ex);
      }
    }
  });
};

exports.editProduct = (req, res, next) => {
  upload.single("imgCate")(req, res, async (err) => {
    if (err) {
      res.status(400).send("Error while uploading image");
    } else {
      // const { error } = validProduct(req.body);
      // if (error) return res.status(400).send(error.details[0].message);
      const { price, trailer, numberInstore, stars } = req.body;
      try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send("Invalid product");
        const updateBody =
          req.files.length !== 0
            ? {
                nameProduct,
                category,
                description,
                price,
                image: req.file.filename,
              }
            : {
                nameProduct,
                category,
                description,
                price,
              };
        product = await Product.findByIdAndUpdate(req.params.id, updateBody, {
          new: true,
        });
        res.send(
          _.pick(product, ["nameProduct", "category", "description", "price"])
        );
      } catch (ex) {
        next(ex);
      }
    }
  });
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndRemove(req.params.id);
    if (!product) return res.status(404).send("Invalid product");
    res.send("Product is deleted");
  } catch (ex) {
    next(ex);
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort("title").populate("category");
    res.send(products);
  } catch (ex) {
    next(ex);
  }
};

exports.getProductDetail = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) return res.status(404).send("Invalid product");
    res.send(product);
  } catch (ex) {
    next(ex);
  }
};

exports.searchProduct = async (req, res, next) => {
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

exports.getProductByCategory = async (req, res, next) => {
  try {
    const products = await Product.find({ category: req.params.categoryId });
    res.send(products);
  } catch (ex) {
    next(ex);
  }
};

exports.decreaseQuantity = (req, res, next) => {
  let bulkOps = req.body.order.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item._id },
        update: {
          $inc: { numberInstore: -item.count, numberSold: +item.count },
        },
      },
    };
  });
  Product.bulkWrite(bulkOps, {}, (error, product) => {
    if (error) {
      return res.status(400).json({
        error: "Could not update the product",
      });
    }
    next();
  });
};
