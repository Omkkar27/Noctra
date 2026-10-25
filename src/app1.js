const express = require("express");
const path = require("path");
const coookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes5.js");
const musicRoutes = require("./routes/music.routes7.js");

const app = express();
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.json()); //Body Reader — reads JSON from req.body
app.use(coookieParser()); //Cookie Reader — reads cookies from req.cookies

app.use("/api/auth", authRoutes);
app.use("/api/music", musicRoutes); //step 2

module.exports = app;
