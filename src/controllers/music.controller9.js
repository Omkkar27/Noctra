const musicModel = require("../models/music.model8.js");
const { uploadFile } = require("../services/storage.service10.js");
const albumModel = require("../models/album.model11.js");

// 1. CREATE MUSIC CONTROLLER
async function createMusic(req, res) {
  try {
    const { title } = req.body;
    const file = req.file;

    if (!title || !file) {
      return res.status(400).json({
        message: "Title and music file are required",
      });
    }

    const result = await uploadFile(
      file.buffer.toString("base64"),
      file.originalname,
    );

    const music = await musicModel.create({
      uri: result.url,
      title,
      artist: req.user.id,
    });

    return res.status(201).json({
      message: "Music uploaded successfully",
      music: {
        id: music._id,
        uri: music.uri,
        title: music.title,
        artist: music.artist,
      },
    });
  } catch (error) {
    console.error("Create music error:", error);

    return res.status(500).json({
      message: "Failed to upload music",
      error: error.message,
    });
  }
}

// 2. CREATE ALBUM CONTROLLER
async function createAlbum(req, res) {
  try {
    const { title, musicIds } = req.body;

    if (!title || !Array.isArray(musicIds)) {
      return res.status(400).json({
        message: "Title and musicIds array are required",
      });
    }

    const album = await albumModel.create({
      title,
      artist: req.user.id,
      music: musicIds,
    });

    return res.status(201).json({
      message: "Album created successfully",
      album: {
        id: album._id,
        title: album.title,
        artist: album.artist,
        music: album.music,
      },
    });
  } catch (error) {
    console.error("Create album error:", error);

    return res.status(500).json({
      message: "Failed to create album",
      error: error.message,
    });
  }
}

async function getAllMusic(req, res) {
  const music = await musicModel.find().populate("artist"); //start giving details of the feild in ""

  res.status(200).json({ message: "music fetched succesfully", music: music });
}

async function getAllAlbums(req, res) {
  const album = await albumModel
    .find()
    .select("title artist ")
    .populate("artist", "username email")
    .populate("music");

  res.status(200).json({
    messsage: "Album fetched succesfully",
    album: album,
  });
}

async function getAlbumById(req, res) {
  const albumId = req.params.albumId;

  const album = await albumModel
    .findById(albumId)
    .populate("artist", "username email");

  return res.status(200).json({
    message: "album fetched succesfully",
    album: album,
  });
}
module.exports = {
  createMusic,
  createAlbum,
  getAllMusic,
  getAllAlbums,
  getAlbumById,
};
