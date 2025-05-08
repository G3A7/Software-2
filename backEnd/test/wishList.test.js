// helpers...
const mongoose = require("mongoose");
const app = require("../index.js");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const Wishlist = require("../models/wishList.model");
const request = require("supertest");
require("dotenv").config();

let user;
let token = "";
let product;

beforeAll(async () => {
  await mongoose.connect(
    process.env.URL.replace("<db_password>", process.env.db_password).replace(
      "${DB_NAME}",
      process.env.DB_NAME
    )
  );

  await request(app).post("/api/v1/auth/register").send({
    name: "Ahmed",
    email: "Ahmed@gmail.com",
    password: "Ahmed123!",
    repassword: "Ahmed123!",
    phone: "01279281753",
  });

  const res = await request(app).post("/api/v1/auth/login").send({
    email: "Ahmed@gmail.com",
    password: "Ahmed123!",
  });
  //   console.log(res.body.data.token);
  token = res.body.data.token;
  console.log(token);
  product = await Product.create({
    name: "Test",
    price: 100,
    description: "A product for testing",
    fileImage: "../uploads/Zain.jpg",
  });
});

afterAll(async () => {
  jest.restoreAllMocks();
  await Wishlist.deleteMany({});
  await User.deleteMany({});
  await Product.deleteMany({});
  await mongoose.connection.close();
});

describe("addOrRemove", () => {
  it("add", async () => {
    console.log(token);
    const wish = await request(app)
      .post(`/api/v1/wishlist/${product._id}`)
      .set("Authorization", token);
    expect(wish.status).toBe(201);
  });

  it("should remove product from wishlist", async () => {
    const res = await request(app)
      .post(`/api/v1/wishlist/${product._id}`)
      .set("Authorization", token);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Product removed from wishlist");
  });

  it("internal error", async () => {
    // Simulate internal error by mocking Wishlist.findOne
    jest.spyOn(Wishlist, "findOne").mockImplementationOnce(() => {
      throw new Error("DB Error");
    });

    const res = await request(app)
      .post(`/api/v1/wishlist/${product._id}`)
      .set("Authorization", token);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Server error");
  });
});

describe("getWishlist", () => {
  it("should get the user's wishlist", async () => {
    await request(app)
      .post(`/api/v1/wishlist/${product._id}`)
      .set("Authorization", token);

    const res = await request(app)
      .get("/api/v1/wishlist")
      .set("Authorization", token);

    expect(res.status).toBe(200);
  });

  it("should handle internal server error", async () => {
    jest.spyOn(Product, "find").mockImplementationOnce(() => {
      throw new Error("Internal Error");
    });
    const res = await request(app)
      .get("/api/v1/wishlist")
      .set("Authorization", token);

    expect(res.status).toBe(500);
  });
});
