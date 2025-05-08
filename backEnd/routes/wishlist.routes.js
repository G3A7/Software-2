const express = require("express");
const router = express.Router();
const verifyToken = require("../utils/verifyToken");
const {
  addToWishlist,
  getWishlist,
} = require("../controllers/wishList.controller");
router.route("/").get(verifyToken, getWishlist);
router.route("/:prId").post(verifyToken, addToWishlist);

module.exports = router;
