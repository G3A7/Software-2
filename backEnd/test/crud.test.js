// helpers...
const mongoose = require("mongoose");
const app = require("../index.js");
const Product = require("../models/product.model.js");
const request = require("supertest");
require("dotenv").config();
const path = require("path");
const imagePath = path.join(__dirname, "../uploads/Zain.jpg");
let token = "";
beforeAll(async () => {
  await mongoose.connect(
    process.env.URL.replace("<db_password>", process.env.db_password).replace(
      "${DB_NAME}",
      process.env.DB_NAME
    )
  );
  await request(app).post("/api/v1/auth/register").send({
    name: "Admin",
    email: "Admin@gmail.com",
    password: "Admin123!",
    repassword: "Admin123!",
    phone: "01279281753",
    role: "admin",
  });

  const res = await request(app).post("/api/v1/auth/login").send({
    email: "Admin@gmail.com",
    password: "Admin123!",
  });
  //   console.log(res.body.data.token);
  token = res.body.data.token;
  console.log(token);
});

afterAll(async () => {
  jest.restoreAllMocks();
  await Product.deleteMany({});
  await mongoose.connection.close();
});

// Get Single Product ✔
describe("GET /api/v1/products", () => {
  // if found ✔
  it("should return single products", async () => {
    const product = await Product.create({
      name: "test",
      price: 100,
      description: "test product",
      file: "../uploads/Zain.jpg",
    });
    const res = await request(app)
      .get(`/api/v1/products/${product._id}`)
      .set("Authorization", token);

    expect(res.status).toBe(200);
    // expect(res.body.data.product.name).toBe("test");
  });
  //   if not Found ✔
  it("should return 404 if product not found", async () => {
    const res = await request(app)
      .get("/api/v1/products/123456789012345678901234")
      .set("Authorization", token);
    expect(res.status).toBe(404);
    // expect(res.body.message).toBe("Product not found");
  });

  it("should return 500 if there is an internal server error", async () => {
    jest.spyOn(Product, "findById").mockImplementationOnce(() => {
      throw new Error("Internal Error");
    });

    const res = await request(app)
      .get("/api/v1/products/123456789012345678901234")
      .set("Authorization", token);

    expect(res.status).toBe(500);
  });
});

// Get All Products ✔
describe("GET /api/v1/products", () => {
  // if products found ✔
  it("should return all products", async () => {
    // إضافة منتجين علشان نختبر إنهم بيرجعوا
    await Product.create([
      {
        name: "Product 1",
        price: 100,
        description: "Description 1",
        fileImage: "../uploads/Zain.jpg",
      },
      {
        name: "Product 2",
        price: 200,
        description: "Description 2",
        fileImage: "../uploads/Zain.jpg",
      },
    ]);

    const res = await request(app)
      .get("/api/v1/products")
      .set("Authorization", token);

    expect(res.status).toBe(200);
    // expect(res.body.status).toBe("Success");
    // expect(res.body.data.products.length).toBeGreaterThanOrEqual(2);
  });

  //   if internal server error ✔
  it("should return 500 if internal server error occurs", async () => {
    jest.spyOn(Product, "find").mockImplementationOnce(() => {
      throw new Error("Internal Error");
    });
    const res = await request(app)
      .get("/api/v1/products")
      .set("Authorization", token);
    expect(res.status).toBe(500);
  });
});

// Create Product ✔
describe("POST /api/v1/products", () => {
  // if created ✔
  it("should create a new product", async () => {
    const res = await request(app)
      .post("/api/v1/products")
      .field("name", "test")
      .field("price", 100)
      .field("description", "test product")
      .attach("fileImage", imagePath)
      .set("Authorization", token);
    expect(res.status).toBe(201);
    expect(res.body.data.product.name).toBe("test");
  });
  // if fild not found ✔
  it("should return 400 if product not created", async () => {
    const res = await request(app)
      .post("/api/v1/products")
      .field("price", 100)
      .field("description", "test product")
      .attach("fileImage", imagePath)
      .set("Authorization", token);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("All fields are required");
  });

  //   if  name not validate ✔
  it("should return 400 if productName not created", async () => {
    const res = await request(app)
      .post("/api/v1/products")
      .field("name", "t")
      .field("price", 100)
      .field("description", "test product")
      .attach("fileImage", imagePath)
      .set("Authorization", token);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Name must be between 3 and 10 characters");
  });

  // if name too long ❗️ [جديد]
  it("should return 400 if name is too long", async () => {
    const res = await request(app)
      .post("/api/v1/products")
      .field("name", "VeryLongProductName") // >10 chars
      .field("price", 100)
      .field("description", "This is a valid description")
      .attach("fileImage", imagePath)
      .set("Authorization", token);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Name must be between 3 and 10 characters");
  });
  // if Price not validate ✔
  it("should return 400 if productPrice not created", async () => {
    const res = await request(app)
      .post("/api/v1/products")
      .field("name", "test")
      .field("price", -100)
      .field("description", "test product")
      .attach("fileImage", imagePath)
      .set("Authorization", token);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Price must be a positive number");
  });

  // if price is not a number ❗️ [جديد]
  it("should return 400 if price is not a number", async () => {
    const res = await request(app)
      .post("/api/v1/products")
      .field("name", "test")
      .field("price", "abc")
      .field("description", "This is a valid description")
      .attach("fileImage", imagePath)
      .set("Authorization", token);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Price must be a positive number");
  });

  // if Description not validate ✔
  it("should return 400 if productDescription not created", async () => {
    const res = await request(app)
      .post("/api/v1/products")
      .field("name", "test")
      .field("price", 100)
      .field("description", "test")
      .attach("fileImage", imagePath)
      .set("Authorization", token);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe(
      "Description must be at least 10 characters long"
    );
  });

  // if file not found ✔
  it("should return 400 if file not found", async () => {
    const res = await request(app)
      .post("/api/v1/products")
      .field("name", "test")
      .field("price", 100)
      .field("description", "test product")
      .set("Authorization", token);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("File not found");
  });

  // internal server error ✔
  it("should return 500 if error occurs while creating product", async () => {
    jest.spyOn(Product.prototype, "save").mockImplementationOnce(() => {
      throw new Error("Internal Error");
    });

    const res = await request(app)
      .post("/api/v1/products")
      .field("name", "test")
      .field("price", 100)
      .field("description", "test product")
      .attach("fileImage", imagePath)
      .set("Authorization", token);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Internal Error");
  });
});

// update Product ✔
describe("PUT /api/v1/products", () => {
  // if updated ✔
  it("should update a product", async () => {
    const product = await Product.create({
      name: "test",
      price: 100,
      description: "test product",
      file: "../uploads/Zain.jpg",
    });
    const res = await request(app)
      .put(`/api/v1/products/${product._id}`)
      .send({
        name: "test",
        price: 200,
        description: "test product",
        fileImage: "../uploads/Zain.jpg",
      })
      .set("Authorization", token);

    expect(res.status).toBe(200);
    expect(res.body.data.product.name).toBe("test");
  });

  //   --------------------------------------
  //   if price not validate ✔
  it("should return 400 if productPrice not created", async () => {
    const product = await Product.create({
      name: "test",
      price: 100,
      description: "test product",
      file: "../uploads/Zain.jpg",
    });
    const res = await request(app)
      .put(`/api/v1/products/${product._id}`)
      .send({
        price: -200,
      })
      .set("Authorization", token);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Price must be a positive number");
  });
  // if price is not a number ❗️ [جديد]
  it("should return 400 if updated price is not a number", async () => {
    const product = await Product.create({
      name: "test",
      price: 100,
      description: "valid description",
      file: "../uploads/Zain.jpg",
    });

    const res = await request(app)
      .put(`/api/v1/products/${product._id}`)
      .send({ price: "abc" })
      .set("Authorization", token);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Price must be a positive number");
  });

  // --------------------------------
  // if not found ✔
  it("should return 404 if product not found", async () => {
    const res = await request(app)
      .put("/api/v1/products/123456789012345678901234")
      .send({
        name: "test",
        price: 200,
        description: "test product",
        fileImage: "../uploads/Zain.jpg",
      })
      .set("Authorization", token);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Product not found");
  });

  // internal server error ✔
  it("should return 500 if internal server error occurs during update", async () => {
    // بنعمل منتج نشتغل عليه
    const product = await Product.create({
      name: "test",
      price: 100,
      description: "test product",
      file: "../uploads/Zain.jpg",
    });

    jest.spyOn(Product, "findByIdAndUpdate").mockImplementationOnce(() => {
      throw new Error("Internal Error");
    });

    const res = await request(app)
      .put(`/api/v1/products/${product._id}`)
      .send({
        name: "test",
        price: 200,
        description: "test product",
        fileImage: "../uploads/Zain.jpg",
      })
      .set("Authorization", token);
    //   .field("name", "test updated")
    //   .field("price", 150)
    //   .field("description", "updated description")
    //   .attach("fileImage", imagePath);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Internal Error");
  });
});

describe("DELETE /api/v1/products/:id", () => {
  it("should delete product successfully", async () => {
    const product = await Product.create({
      name: "test product",
      price: 100,
      description: "test description",
      fileImage: "../uploads/Zain.jpg",
    });

    const res = await request(app)
      .delete(`/api/v1/products/${product._id}`)
      .set("Authorization", token);

    expect(res.status).toBe(200);

    //   const deleted = await Product.findById(product._id);
    //   expect(deleted).toBeNull();
  });

  it("should return 404 if product not found", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .delete(`/api/v1/products/${nonExistentId}`)
      .set("Authorization", token);

    expect(res.status).toBe(404);
  });

  it("should return 500 if internal server error occurs", async () => {
    jest.spyOn(Product, "findByIdAndDelete").mockImplementationOnce(() => {
      throw new Error("Internal Error");
    });

    // const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/api/v1/products/123456789012345678901234`)
      .set("Authorization", token);

    expect(res.status).toBe(500);
  });
});
