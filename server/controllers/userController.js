const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookie = require("cookie-parser");

function generateToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
}
module.exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: "Please use a valid email address" });
    }
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters long" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

    
    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "strict", // Prevent CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
    return res.status(201).json({ msg: "User created successfully" });
  } catch (err) {
    console.error("Server Error:", err);
    return res
      .status(500)
      .json({ msg: `Internal server error: ${err.message}` });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials", login: false });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials", login: false });
    }
    const token = generateToken(user);

    res.cookie("token", token, {
        httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
        sameSite: "strict", // Prevent CSRF attacks
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });


    return res.status(200).json({ msg: "Login successful" });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: `Internal server error: ${err.message}` });
  }
};

module.exports.logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({msg: "Logged out successfully"});
}