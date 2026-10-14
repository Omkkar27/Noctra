const express = require("express");
const coookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes5.js");

const app = express();
app.use(express.json()); //Body Reader — reads JSON from req.body
app.use(coookieParser()); //Cookie Reader — reads cookies from req.cookies

app.use("/api/auth", authRoutes);

module.exports = app;
