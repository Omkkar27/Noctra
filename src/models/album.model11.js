const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  music: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "music",
    },
  ],
  artist: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});
const albumModel = mongoose.model("album", albumSchema);

module.exports = albumModel;
