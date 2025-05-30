const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    repassword: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
