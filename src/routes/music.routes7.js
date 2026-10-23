const express = require("express");
const musicController = require("../controllers/music.controller9.js");
const authMiddleware = require("../middleware/auth.middleware12.js");

const multer = require("multer");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});
//api's
router.post(
  "/upload",
  authMiddleware.authArtist,
  upload.single("music"),
  musicController.createMusic,
);

router.post("/album", authMiddleware.authArtist, musicController.createAlbum);

router.get("/", authMiddleware.authUser, musicController.getAllMusic);

router.get("/album", authMiddleware.authUser, musicController.getAllAlbums);

router.get(
  "/album/:albumId",
  authMiddleware.authUser,
  musicController.getAlbumById,
);

module.exports = router;
