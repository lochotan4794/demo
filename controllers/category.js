const fs = require("fs");
const { Category, validCategory } = require("../models/category");
const upload = require("../middlewares/upload");
const _ = require("lodash");
exports.createCategory = (req, res, next) => {
  upload.array("imgCate", 2)(req, res, async (err) => {
    if (err) {
      res.status(400).send("Error while uploading images");
    } else {
      const { name, description } = req.body;
      const { error } = validCategory(req.body);
      if (error) return res.status(400).send(error.details[0].message);
      const body =
        req.files.length !== 0
          ? {
              name,
              description,
              image: req.files[0].filename,
              thumbnail: req.files[1].filename,
            }
          : { name, description };
      let category = new Category(body);
      try {
        await category.save();
        res.send(_.pick(category, ["name", "image", "thumbnail"]));
      } catch (ex) {
        console.log("Errrrrrrrrrr");
        next(ex);
      }
    }
  });
};

exports.editCategory = (req, res, next) => {
  upload.array("imgCate", 2)(req, res, async (err) => {
    if (err) {
      res.status(400).send("Error while uploading image");
    } else {
      const { name, description } = req.body;
      try {
        let category = await Category.findById(req.params.id);
        if (!category) return res.status(404).send("Invalid category");
        const updateBody =
          req.files.length !== 0
            ? {
                name,
                description,
                image: req.files[0].filename,
                thumbnail: req.files[1].filename,
              }
            : {
                name,
                description,
              };
        category = await Category.findByIdAndUpdate(req.params.id, updateBody, {
          new: true,
        });
        res.send(_.pick(category, ["name", "image", "thumbnail"]));
      } catch (ex) {
        next(ex);
      }
    }
  });
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndRemove(req.params.id);
    if (!category) return res.status(404).send("Invalid category");
    fs.unlink("./public/assets/" + category.image, (err) => {
      if (err) {
        next(err);
      }
    });
    fs.unlink("./public/assets/" + category.thumbnail, (err) => {
      if (err) {
        next(err);
      }
    });
    res.send("Category's deleted");
  } catch (ex) {
    next(ex);
  }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort("name");
    res.send(categories);
  } catch (ex) {
    next(ex);
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).send("Invalid category");
    res.send(category);
  } catch (ex) {
    next(ex);
  }
};

exports.searchCategory = async (req, res, next) => {
  try {
    const { name } = req.query;
    const query = ".*" + name + ".*";
    const categories = await Category.find({
      name: { $regex: new RegExp(query), $options: "i" },
    });
    res.send(categories);
  } catch (ex) {
    next(ex);
  }
};
