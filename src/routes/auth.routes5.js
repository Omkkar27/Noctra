const express = require("express");
const authController = require("../controllers/auth.controller6.js");

const routes = express.Router();

routes.post("/register", authController.registerUser);

routes.post("/login", authController.loginUser);

module.exports = routes;
