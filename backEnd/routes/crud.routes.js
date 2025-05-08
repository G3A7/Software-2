const express = require("express");
const {
  AddProduct,
  GetAllProducts,
  updateProduct,
  deleteProduct,
  GetSingleProduct,
} = require("../controllers/crud.controller");
const verifyToken = require("../utils/verifyToken");
const allowedTo = require("../utils/allowedTo");

const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + "." + file.mimetype.split("/")[1];
    cb(null, filename);
  },
});
const upload = multer({ storage });
router
  .route("/")
  .get(verifyToken, GetAllProducts)
  .post(
    upload.single("fileImage"),
    verifyToken,
    allowedTo("admin"),
    AddProduct
  );
router
  .route("/:id")
  .get(verifyToken, GetSingleProduct)
  .delete(verifyToken, allowedTo("admin"), deleteProduct)
  .put(verifyToken, allowedTo("admin"), updateProduct);
// .get(getSingleProduct);

module.exports = router;
