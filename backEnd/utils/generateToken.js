const jwt = require("jsonwebtoken");

async function generateToken(payload) {
  const token = await jwt.sign(payload, process.env.JWTSECRETKEY, {
    expiresIn: "10d",
  });
  return token;
}

module.exports = generateToken;
