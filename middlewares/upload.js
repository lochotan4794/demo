const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./public/assets/",
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({
  storage,
});

module.exports = upload;
