const Wishlist = require("../models/wishList.model");
const sumPrice = require("../utils/sumPrice");
// const Product = require("../models/product.model");
// const User = require("../models/user.model");

// Iduser ,,, Idproduct
const addToWishlist = async (req, res) => {
  const userId = req.currentUser.id;
  const { prId } = req.params;
  try {
    const exists = await Wishlist.findOne({ user: userId, product: prId });
    if (exists) {
      await Wishlist.findOneAndDelete({
        user: userId,
        product: prId,
      });
      return res.status(200).json({ message: "Product removed from wishlist" });
    }

    const wish = new Wishlist({ user: userId, product: prId });
    await wish.save();

    res.status(201).json({ message: "Product added to wishlist" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// const product = await Wishlist.findOneAndDelete({
//   user: userId,
//   product: prId,
// });
// if (!product) {
//   return res
//     .status(404)
//     .json({ message: "Product not found in wishlist" });
// }

const getWishlist = async (req, res) => {
  const userId = req.currentUser.id;
  let sum = 0;
  try {
    const wishlist = await Wishlist.find({ user: userId }).populate("product");
    // console.log(
    //   "-------------------------\n",
    //   wishlist,
    //   "------------------------------\n"
    // );
    // if (wishlist?.length > 0) {
      sum =  sumPrice(wishlist);
      //   // return res.status(404).json({ message: "Wishlist not found" });
    // }
    return res
      .status(200)
      .json({ status: "Success", data: { wishlist, sum }, code: 201 });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// const deleteFromWishlist = async (req, res) => {
//   const userId = req.user.id;
//   const { productId } = req.params;
//   try {
//     const product = await Wishlist.findOneAndDelete({
//       user: userId,
//       product: productId,
//     });
//     if (!product) {
//       return res.status(404).json({ message: "Product not found in wishlist" });
//     }
//     res.status(201).json({ message: "Product removed from wishlist" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

module.exports = { addToWishlist, getWishlist };
