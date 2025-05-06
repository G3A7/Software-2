const User = require("../models/user.model");
async function register(req, res) {
  try {
    const { name, email, password, repassword, phone } = req.body;
    console.log(name, email, password);
    if (!/^[a-zA-Z]{3,12}$/i.test(name) || !name) {
      return res
        .status(400)
        .json({ status: "fail", mesage: "must be range 3 to 12 Char 😄" });
    }
    if (!/^[a-zA-Z0-9]+@gmail\.com$/i.test(email) || !email) {
      return res
        .status(400)
        .json({ status: "fail", mesage: "must be Email is Valid😄" });
    }
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password) || !password) {
      return res.status(400).json({
        status: "fail",
        message:
          "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character (@$!%*?&) 😄",
      });
    }
    if (!matchPassBtwRepassword(repassword, password)) {
      return res.status(400).json({
        status: "fail",
        message: "Password and Repassword must be same 😄",
      });
    }

    if (!/^(020)?(010|012|015|011)[0-9]{8}$/.test(phone)) {
      return res.status(400).json({
        status: "fail",
        message:
          "Phone number must be valid and start with 010, 011, 012, 015, or 020 😄",
      });
    }

    const userFound = await User.findOne({ email });
    if (userFound) {
      return res
        .status(400)
        .json({ status: "fail", message: "User Already Exists 😄" });
    }

    const user = new User(req.body);

    await user.save();
    const userDetails = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
    };
    return res
      .status(201)
      .json({ status: "Success", data: { user: userDetails }, code: 201 });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
}
async function login(req, res) {
  try {
    const { password, email } = req.body;
    if (!/^[a-zA-Z0-9]+@gmail\.com$/i.test(email) || !email) {
      return res
        .status(400)
        .json({ status: "fail", mesage: "must be Email is Valid😄" });
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password) || !password) {
      return res.status(400).json({
        status: "fail",
        message:
          "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character (@$!%*?&) 😄",
      });
    }

    const user = await User.findOne({ email });
    if (!user || !matchPass(password, user.password)) {
      return res
        .status(400)
        .json({ status: "fail", message: "something Error 😗" });
    }
    return res.status(200).json({ status: "Success", data: { user } });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
}

function matchPass(password, usePassword) {
  return password == usePassword;
}
function matchPassBtwRepassword(password, repassword) {
  return password == repassword;
}

module.exports = {
  login,
  register,
};
