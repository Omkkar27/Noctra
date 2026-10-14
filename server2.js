require("dotenv").config(); // Load .env variables 🔐
const app = require("./src/app1.js");
const connectDB = require("./src/db/db3.js");

connectDB();

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
