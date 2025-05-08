const jwt = require("jsonwebtoken");
const verifyToken = require("../utils/verifyToken");

jest.mock("jsonwebtoken");

describe("verifyToken middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return 401 if Authorization header is missing", () => {
    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "Token is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if token is invalid", () => {
    req.headers["authorization"] = "invalidtoken";
    jwt.verify.mockImplementation(() => {
      throw new Error("invalid token");
    });

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "Invalid token",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next if token is valid", () => {
    req.headers["authorization"] = "validtoken";
    const fakeUser = { id: "123", role: "admin" };

    jwt.verify.mockReturnValue(fakeUser);

    verifyToken(req, res, next);

    expect(req.currentUser).toEqual(fakeUser);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
