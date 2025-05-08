// const token = "";
// // const mongoose = require("mongoose");
// const app = require("../index.js");
// // const Product = require("../models/product.model.js");
// const request = require("supertest");
// const allowedTo = require("../utils/allowedTo");
// require("dotenv").config();
// beforeAll(async () => {
//   await mongoose.connect(
//     process.env.URL.replace("<db_password>", process.env.db_password).replace(
//       "${DB_NAME}",
//       process.env.DB_NAME
//     )
//   );
//   await request(app).post("/api/v1/auth/register").send({
//     name: "Admin",
//     email: "Admin1@gmail.com",
//     password: "Admin1234!",
//     repassword: "Admin1234!",
//     phone: "01279281753",
//     role: "admin",
//   });

//   const res = await request(app).post("/api/v1/auth/login").send({
//     email: "Admin1@gmail.com",
//     password: "Admin1234!",
//   });
//   //   console.log(res.body.data.token);
//   token = res.body.data.token;
// });

// describe("allowed", () => {
//   it("", async () => {
//     await request(app)
//       .get("/api/v1/products/", allowedTo("admin"))
//       .send({
//         name: "test",
//         price: "200",
//         description: "dasdasdasdasdasdasda",
//         fileImage: "../uploads/Zain.jpg",
//       })
//       .set("Authorization", token);
//   });
// });

const allowedTo = require("../utils/allowedTo");

describe("allowedTo middleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      currentUser: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should call next() if role matches", () => {
    req.currentUser.role = "admin";
    const middleware = allowedTo("admin");

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    // expect(res.json).not.toHaveBeenCalled();
  });

  it("should return 401 if role does not match", () => {
    req.currentUser.role = "user";
    const middleware = allowedTo("admin");

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
