const Joi = require("joi");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 5, maxlength: 32 },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  storyline: { type: String, required: true, minlength: 32 },
  author: { type: String, required: true, minlength: 5, maxlength: 32 },
  price: { type: Number, required: true, min: 20, max: 1000 },
  trailer: { type: String, required: true },
  thumbnail: { type: String, required: true },
  poster: { type: String, required: true },
  duration: { type: String, required: true },
  imdb: { type: Number, required: true },
  release: { type: String, required: true },
  numberSold: { type: Number, min: 0, default: 0 },
  numberInstore: { type: Number, min: 0, default: 0 },
  stars: Number,
});

const Product = mongoose.model("Product", productSchema);

function validProduct(product) {
  const schema = Joi.object({
    title: Joi.string()
      .required()
      .min(5)
      .max(32),
    category: Joi.string().required(),
    storyline: Joi.string().required(),
    author: Joi.string()
      .required()
      .min(5)
      .max(32),
    price: Joi.number()
      .required()
      .min(20)
      .max(1000),
    trailer: Joi.string().required(),
    thumbnail: Joi.string(),
    poster: Joi.string(),
    duration: Joi.string().required(),
    imdb: Joi.number().required(0),
    release: Joi.string().required(0),
    numberSold: Joi.number().min(0),
    numberInstore: Joi.number().min(0),
    stars: Joi.number(),
  });
  return schema.validate(product);
}

module.exports.Product = Product;
module.exports.productSchema = productSchema;
module.exports.validProduct = validProduct;
