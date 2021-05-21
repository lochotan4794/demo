const express = require("express");
const {
  createBag,
  editBag,
  deleteBag,
  searchBag,
  getAllBag,
  getBagDetail,
} = require("../controllers/bag");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const router = express.Router();

router.get("/", getAllBag);
router.get("/search", searchBag);
router.get("/:id", getBagDetail);
router.post("/", [auth, admin], createBag);
router.put("/:id", [auth, admin], editBag);
router.delete("/:id", [auth, admin], deleteBag);

module.exports = router;
