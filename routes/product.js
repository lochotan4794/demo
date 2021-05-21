const express = require("express");
const {
  createProduct,
  editProduct,
  deleteProduct,
  searchProduct,
  getAllProducts,
  getProductByCategory,
  getProductDetail,
} = require("../controllers/product");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const router = express.Router();

router.get("/", getAllProducts);
router.get("/search", searchProduct);
router.get("/:id", getProductDetail);
router.get("/cate/:categoryId/", getProductByCategory);
router.post("/", [auth, admin], createProduct);
router.put("/:id", [auth, admin], editProduct);
router.delete("/:id", [auth, admin], deleteProduct);

module.exports = router;
