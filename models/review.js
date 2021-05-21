const mongoose = require("mongoose");
const Joi = require("joi");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 5,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    thumbnail: {
      type: String,
    },
    content: {
      type: String,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

function validReview(review) {
  const schema = Joi.object({
    title: Joi.string()
      .min(5)
      .required(),
    categoryId: Joi.string().required(),

    userId: Joi.string().required(),
    content: Joi.string().required(),
  });
  return schema.validate(review);
}

module.exports.Review = Review;
module.exports.validReview = validReview;
