const upperString = require("../utils/upper");

describe("confirm string be UpperCase", () => {
  it("string correct", () => {
    expect(upperString("ahmed")).toMatch("Ahmed");
  });
});
