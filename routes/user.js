const express = require("express");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const {
  authAdmin,
  authUser,
  createUser,
  deleteUser,
  editMe,
  editUser,
  getAllUser,
  getCurrentUser,
  searchUser,
  isUserValid,
} = require("../controllers/user");

const { getReviewsByUser } = require("../controllers/review");
const router = express.Router();

router.get("/", [auth, admin], getAllUser);
router.get("/search", [auth, admin], searchUser);
router.get("/me", auth, getCurrentUser);
router.get("/reviews", auth, getReviewsByUser);
router.post("/auth", authUser);
router.post("/admin", authAdmin);
router.post("/create", createUser);
router.put("/:id", [auth, admin], editUser);
router.put("/", auth, editMe);
router.delete("/:id", [auth, admin], deleteUser);
router.get("/isValid", [auth], isUserValid);
module.exports = router;
