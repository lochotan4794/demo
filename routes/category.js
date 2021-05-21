const express = require("express");
const {
  createCategory,
  editCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  searchCategory,
} = require("../controllers/category");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");

const router = express.Router();
router.get("/", getAllCategories);
router.get("/search", searchCategory);
router.get("/:id", getCategory);
router.post("/", [auth, admin], createCategory);
router.put("/:id", [auth, admin], editCategory);
router.delete("/:id", [auth, admin], deleteCategory);

module.exports = router;
