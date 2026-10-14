const mongoose = require("mongoose"); //model->decides ki schema me kaun kaun sa value jaayega

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["user", "artist"],
    default: "user",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
