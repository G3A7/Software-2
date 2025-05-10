const Product = require("../models/product.model.js");
const upperString = require("../utils/upper.js");
const AddProduct = async (req, res) => {
  try {
    console.log(req.body);
    let { name, price, description } = req.body;
    if (!name || !price || !description) {
      return res
        .status(400)
        .json({ status: "fail", message: "All fields are required" });
    }
    if (!(name.length >= 3 && name.length <= 10)) {
      return res.status(400).json({
        status: "fail",
        message: "Name must be between 3 and 10 characters",
      });
    }
    if (isNaN(price) || price <= 0) {
      return res
        .status(400)
        .json({ status: "fail", message: "Price must be a positive number" });
    }
    if (description.length < 10) {
      return res.status(400).json({
        status: "fail",
        message: "Description must be at least 10 characters long",
      });
    }

    const fileImage = req.file?.filename;
    if (!fileImage) {
      return res
        .status(400)
        .json({ status: "fail", message: "File not found" });
    }
    console.log(fileImage);

    name = upperString(name);
    const product = new Product({
      name,
      price,
      description,
      fileImage: fileImage,
    });
    console.log(product);
    await product.save();
    return res
      .status(201)
      .json({ status: "Success", data: { product }, code: 201 });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};
const GetAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json({ status: "Success", data: { products } });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};
const GetSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ status: "fail", message: "Product not found" });
    }
    return res.status(200).json({ status: "Success", data: { product } });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res
        .status(404)
        .json({ status: "fail", message: "Product not found" });
    }
    return res.status(200).json({ status: "Success", data: { product } });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;
    console.log(price, id);
    if (isNaN(price) || price <= 0) {
      return res
        .status(400)
        .json({ status: "fail", message: "Price must be a positive number" });
    }
    const product = await Product.findByIdAndUpdate(
      id,
      { price },
      { new: true }
    );
    if (!product) {
      return res
        .status(404)
        .json({ status: "fail", message: "Product not found" });
    }

    return res.status(200).json({ status: "Success", data: { product } });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};
module.exports = {
  AddProduct,
  GetAllProducts,
  deleteProduct,
  updateProduct,
  GetSingleProduct,
};
