const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  // req.headers["Authorization"] ||
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  console.log(authHeader);
  if (!authHeader) {
    return res.status(401).json({
      status: "fail",
      message: "Token is required",
    });
  }
  const token = authHeader;
  try {
    const currentUser = jwt.verify(token, process.env.JWTSECRETKEY);
    console.log(currentUser);
    req.currentUser = currentUser;
    next();
  } catch (err) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid token",
    });
  }
};

module.exports = verifyToken;
