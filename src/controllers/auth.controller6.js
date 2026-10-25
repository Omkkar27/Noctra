const User = require("../models/user.model4.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
const publicUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
});

function sendToken(res, user, status, message) {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
  return res
    .status(status)
    .cookie("token", token, cookieOptions)
    .json({ message, user: publicUser(user) });
}

function registerAs(role) {
  return async (req, res) => {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password)
        return res
          .status(400)
          .json({ message: "Username, email and password are required" });
      if (typeof password !== "string" || password.length < 8)
        return res
          .status(400)
          .json({ message: "Password must be at least 8 characters" });
      const normalizedUsername = username.trim();
      const normalizedEmail = email.trim().toLowerCase();
      const exists = await User.findOne({
        $or: [{ username: normalizedUsername }, { email: normalizedEmail }],
      });
      if (exists)
        return res
          .status(409)
          .json({
            message: "A user with that username or email already exists",
          });
      const user = await User.create({
        username: normalizedUsername,
        email: normalizedEmail,
        password: await bcrypt.hash(password, 12),
        role,
      });
      return sendToken(
        res,
        user,
        201,
        `${role === "artist" ? "Artist" : "User"} account created`,
      );
    } catch (error) {
      if (error.name === "ValidationError")
        return res.status(400).json({ message: error.message });
      if (error.code === 11000)
        return res
          .status(409)
          .json({
            message: "A user with that username or email already exists",
          });
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Unable to create account" });
    }
  };
}

function loginAs(expectedRole) {
  return async (req, res) => {
    try {
      const { identifier, email, username, password } = req.body;
      const value = (identifier || email || username || "").trim();
      if (!value || !password)
        return res
          .status(400)
          .json({ message: "Email or username and password are required" });
      const user = await User.findOne({
        $or: [{ email: value.toLowerCase() }, { username: value }],
      }).select("+password");
      if (!user || !(await bcrypt.compare(password, user.password)))
        return res.status(401).json({ message: "Invalid credentials" });
      if (expectedRole && user.role !== expectedRole)
        return res
          .status(403)
          .json({
            message: `This account is registered as a ${user.role}. Please use the ${user.role} sign-in.`,
          });
      return sendToken(
        res,
        user,
        200,
        `${user.role === "artist" ? "Artist" : "User"} logged in successfully`,
      );
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Unable to sign in" });
    }
  };
}

function logoutUser(req, res) {
  return res
    .clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .json({ message: "Logged out successfully" });
}

module.exports = {
  registerUser: registerAs("user"),
  registerArtist: registerAs("artist"),
  loginUser: loginAs("user"),
  loginArtist: loginAs("artist"),
  logoutUser,
};
