const ImageKit = require("@imagekit/nodejs");

const ImageKitClient = new ImageKit({
  privatekey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function uploadFile(file, fileName) {
  const result = await ImageKitClient.files.upload({
    file,
    fileName,
    folder: "music-clone/music",
  });

  return result;
}

module.exports = { uploadFile };
