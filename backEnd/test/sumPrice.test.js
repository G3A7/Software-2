// const upperString = require("../utils/upper");

const sumPrice = require("../utils/sumPrice");

describe("confirm sum is true ", () => {
  it("sum Correct = 9", () => {
    expect(
      sumPrice([
        {
          product: {
            price: 20,
          },
        },
        {
          product: {
            price: 30,
          },
        },
      ])
    ).toBe(50);
  });
  it("sum Correct = 21 ", () => {
    expect(
      sumPrice([
        {
          product: {
            price: 20,
          },
        },
        {
          product: {
            price: 20,
          },
        },
      ])
    ).toBe(40);
  });
  it(" correct", () => {
    expect(sumPrice([])).toBe(0);
  });
});
