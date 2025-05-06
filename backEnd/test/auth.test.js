
const mongoose = require("mongoose");
const app = require("../index.js");
const User = require("../models/user.model.js");
const request = require("supertest");
require("dotenv").config();

const path = require("path");
const imagePath = path.join(__dirname, "../uploads/Zain.jpg");
beforeEach(async () => {
  await mongoose.connect(
    process.env.URL.replace("<db_password>", process.env.db_password).replace(
      "${DB_NAME}",
      process.env.DB_NAME
    )
  );
});

afterAll(async () => {
  jest.restoreAllMocks();
  await Product.deleteMany({});
  await mongoose.connection.close();
});








