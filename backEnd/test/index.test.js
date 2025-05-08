const request = require("supertest");
const app = require("../index"); // المسار حسب اسم ملفك

describe("404 Handler", () => {
  it("should return 404 for unknown routes", async () => {
    const response = await request(app).get("/unknown-route");
    expect(response.status).toBe(404);
  });
});