const Joi = require("joi");
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 32 },
  description: String,
  thumbnail: String,
  image: String,
});

const Category = mongoose.model("Category", categorySchema);

function validCategory(category) {
  const schema = Joi.object({
    name: Joi.string()
      .required()
      .min(5)
      .max(32),
    description: Joi.string().max(255),
    imgCate: Joi.optional(),
  });
  return schema.validate(category);
}

module.exports.Category = Category;
module.exports.categorySchema = categorySchema;
module.exports.validCategory = validCategory;
