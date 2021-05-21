const { validReview, Review } = require("../models/review");
const upload = require("../middlewares/upload");
const fs = require("fs");

exports.createReview = (req, res, next) => {
  upload.single("thumbnail")(req, res, async (err) => {
    if (err) {
      return res.status(400).send("Error while uploading image!");
    } else {
      const { _id: userId } = req.profile;
      const { title, categoryId, content } = req.body;
      const { error } = validReview({ title, categoryId, userId, content });
      if (error) return res.status(400).send(error.details[0].message);
      const body = req.file
        ? {
            title,
            category: categoryId,
            user: userId,
            thumbnail: req.file.filename,
            content,
          }
        : {
            title,
            category: categoryId,
            user: userId,
            thumbnail: "defaultReviewThumbnail.jpg",
            content,
          };
      const review = new Review(body);
      try {
        await review.save();
        res.send("Create successfully!");
      } catch (ex) {
        next(ex);
      }
    }
  });
};

exports.editReview = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    let review = await Review.findById(req.params.id);
    if (!review) return res.status(404).send("Invalid review");
    review.title = title;
    review.content = content;
    await review.save();
    res.send("Update success");
  } catch (ex) {
    next(ex);
  }
};

exports.getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate("category", "name")
      .populate("user", "name")
      .sort("title");
    res.send(reviews);
  } catch (ex) {
    next(ex);
  }
};

exports.getReviewDetail = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("category", "name")
      .populate("user", "name");
    res.send(review);
  } catch (ex) {
    next(ex);
  }
};

exports.getReviewsByUser = async (req, res, next) => {
  try {
    const { _id } = req.profile;
    const reviews = await Review.find({ user: _id });
    res.send(reviews);
  } catch (ex) {
    next(ex);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndRemove(req.params.id);
    if (!review) return res.status(404).send("Invalid review");
    fs.unlink("./public/assets/" + review.thumbnail, (err) => {
      if (err) {
        next(err);
      }
    });
    res.send("Delete successfully");
  } catch (ex) {
    next(ex);
  }
};

exports.searchReview = async (req, res, next) => {
  try {
    const { title } = req.query;
    const query = ".*" + title + ".*";
    const reviews = await Review.find({
      title: { $regex: new RegExp(query), $options: "i" },
    })
      .populate("category", "name")
      .populate("user", "name");
    res.send(reviews);
  } catch (ex) {
    next(ex);
  }
};
