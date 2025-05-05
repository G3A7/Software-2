const express = require("express");
const {
  AddProduct,
  GetAllProducts,
  updateProduct,
  deleteProduct,
  GetSingleProduct,
} = require("../controllers/crud.controller");
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
  .get(GetAllProducts)
  .post(upload.single("fileImage"), AddProduct);
router
  .route("/:id")
  .get(GetSingleProduct)
  .delete(deleteProduct)
  .put(updateProduct);
// .get(getSingleProduct);

module.exports = router;
