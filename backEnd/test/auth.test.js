const mongoose = require("mongoose");
const app = require("../index.js");
const User = require("../models/user.model.js");
const request = require("supertest");
require("dotenv").config();
const {
  matchPass,
  matchPassBtwRepassword,
} = require("../controllers/auth.controller.js");

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
  await User.deleteMany({});
  await mongoose.disconnect();
  await mongoose.connection.close();
});

describe("User Registreation", () => {
  it("should create a new product", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      name: "test",
      email: "test@gmail.com",
      password: "Test@1234",
      repassword: "Test@1234",
      phone: "01279281753",
    });
    expect(res.status).toBe(201);
  });
  it("should return 400 if name is invalid", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      email: "Test@gmail.com",
      password: "Test@1234",
      repassword: "Test@1234",
      phone: "01012345678",
    });
    expect(res.status).toBe(400);
  });
  it("should return 400 if name is invalid", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      name: "t",
      email: "Test@gmail.com",
      password: "Test@1234",
      repassword: "Test@1234",
      phone: "01012345678",
    });
    expect(res.status).toBe(400);
  });
  it("should return 400 if email is invalid", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      name: "test",
      email: "test",
      password: "Test@1234",
      repassword: "Test@1234",
      phone: "01012345678",
    });
    expect(res.status).toBe(400);
  });
  it("should return 400 if email is invalid", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      name: "test",
      password: "Test@1234",
      repassword: "Test@1234",
      phone: "01012345678",
    });
    expect(res.status).toBe(400);
  });
  it("should return 400 if password is invalid", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      name: "test",
      email: "Test@gmail.com",
      // password: "Test1234",
      repassword: "Test1234",
      phone: "01012345678",
    });
    expect(res.status).toBe(400);
  });
  it("should return 400 if password is invalid", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      name: "test",
      email: "Test@gmail.com",
      password: "Test",
      repassword: "Test1234",
      phone: "01012345678",
    });
    expect(res.status).toBe(400);
  });
  it("should return 400 if password not Equal rePassword", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      name: "test",
      email: "Test@gmail.com",
      password: "Test@1234",
      repassword: "Test@124",
      phone: "01012345678",
    });
    expect(res.status).toBe(400);
  });
  it("should return 400 if phone is invalid", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      name: "test",
      email: "Test@gmail.com",
      password: "Test1234",
      repassword: "Test124",
      // phone: "01012345678",
    });
    expect(res.status).toBe(400);
  });
  it("should return 400 if phone is invalid", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      name: "test",
      email: "Test@gmail.com",
      password: "Test123!",
      repassword: "Test123!",
      phone: "012345678",
    });
    expect(res.status).toBe(400);
  });

  it("should return 400 if the user already exists", async () => {
    // const user = new User({
    //   name: "test",
    //   email: "test@example.com",
    //   password: "Test@1234!",
    //   repassword: "Test@1234!",
    //   phone: "01012345678",
    // });
    // await user.save();
    const user = await User.create({
      name: "test",
      email: "test3@gmail.com",
      password: "Test@1234!",
      repassword: "Test@1234!",
      phone: "01012345678",
    });

    const res = await request(app).post("/api/v1/auth/register").send({
      name: "test",
      email: "test3@gmail.com",
      password: "Test@1234!",
      repassword: "Test@1234!",
      phone: "01012345678",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("User Already Exists 😄");
  });

  it("should return 500 if error occurs while creating User", async () => {
    jest.spyOn(User.prototype, "save").mockImplementationOnce(() => {
      throw new Error("Internal Error");
    });

    const res = await request(app).post("/api/v1/auth/register").send({
      name: "test",
      email: "Test@gmail.com",
      password: "Test1234!",
      repassword: "Test1234!",
      phone: "01279281753",
    });

    expect(res.status).toBe(500);
    // expect(res.body.message).toBe("Internal Error");
  });
});

describe("User Login", () => {
  it("should create a new User", async () => {
    // const user = await User.create({
    //   name: "test",
    //   email: "test4@gmail.com",
    //   password: "Test@123",
    //   repassword: "Test@123",
    //   phone: "01279281753",
    // });
    await request(app).post("/api/v1/auth/register").send({
      name: "test",
      email: "test@gmail.com",
      password: "Test@1234",
      repassword: "Test@1234",
      phone: "01279281753",
    });
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "test@gmail.com",
      password: "Test@1234",
    });
    expect(res.status).toBe(200);
  });

  it("should return 400 if email is invalid", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "test",
      password: "Test@1234",
    });
    expect(res.status).toBe(400);
  });
  it("should return 400 if email is invalid", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      password: "Test@1234",
    });
    expect(res.status).toBe(400);
  });
  it("should return 400 if password is invalid", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "Test@gmail.com",
      // password: "Test1234",
    });
    expect(res.status).toBe(400);
  });
  it("should return 400 if password is invalid", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "Test@gmail.com",
      password: "Test",
    });
    expect(res.status).toBe(400);
  });

  it("should return 400 if not user or not macth pass ", async () => {
    const res = await User.create({
      name: "Ahmed",
      email: "Ahmed@gmail.com",
      password: "Ahmed@123!",
      repassword: "Ahmed@123!",
      phone: "01279281753",
    });

    const res_2 = await request(app).post("/api/v1/auth/login").send({
      email: "Ah7med@gmail.com",
      password: "Test@123!",
    });
    // console.log(res_2);
    expect(res_2.status).toBe(400);
  });

  it("should return 500 if error occurs during login", async () => {
    jest.spyOn(User, "findOne").mockImplementationOnce(() => {
      throw new Error("Internal Error");
    });

    const res = await request(app).post("/api/v1/auth/login").send({
      email: "Test@gmail.com",
      password: "Test@1234",
    });

    expect(res.status).toBe(500);
  });
});

// unit Test for matchPass function and matchPassBtwRepassword
describe("Password matching functions", () => {
  test("matchPass returns true if passwords match", () => {
    expect(matchPass("Test@123", "Test@123")).toBeTruthy();
  });

  test("matchPass returns false if passwords do not match", () => {
    expect(matchPass("Test@123", "WrongPass")).toBeFalsy();
  });

  test("matchPassBtwRepassword returns true if repassword matches password", () => {
    expect(matchPassBtwRepassword("Test@123", "Test@123")).toBeTruthy();
  });

  test("matchPassBtwRepassword returns false if repassword matches password", () => {
    expect(matchPassBtwRepassword("Test@1231", "Test@123")).toBeFalsy();
  });

  // test("matchPassBtwRepassword returns false if repassword does not match", async () => {
  //   const res = await request(app).post("/api/v1/auth/register").send({
  //     name: "test",
  //     email: "Test@gmail.com",
  //     password: "Test@123",
  //     repassword: "Test@124", // كلمات مرور غير متطابقة
  //     phone: "01012345678",
  //   });
  //   expect(res.status).toBe(400); // التحقق من الـ status 400
  //   expect(res.body.message).toBe("Password and Repassword must be same 😄");
  // });
});
