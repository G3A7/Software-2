const request = require("supertest");
const express = require("express");
const allowedTo = require("../utils/allowedTo");

const miniApp = express();

miniApp.use((req, res, next) => {
  req.currentUser = { role: "user" };
  next();
});

miniApp.get("/admin", allowedTo("admin"), (req, res) => {
  res.status(200).json({ status: "success", message: "Welcome admin" });
});

describe("allowedTo Middleware", () => {
  it("should return 401 if user role is not admin", async () => {
    const res = await request(miniApp).get("/admin");
    expect(res.status).toBe(401);
  });
});



/*
it("should allow access if user role matches", async () => {
    const appWithAdmin = express();
    appWithAdmin.use((req, res, next) => {
      req.currentUser = { role: "admin" };
      next();
    });
    appWithAdmin.get("/admin", allowedTo("admin"), (req, res) => {
      res.status(200).json({ status: "success", message: "Welcome admin" });
    });

    const res = await request(appWithAdmin).get("/admin");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Welcome admin");
  });
*/
