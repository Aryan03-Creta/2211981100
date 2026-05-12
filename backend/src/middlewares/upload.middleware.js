const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + path.extname(file.originalname);
    cb(null, unique);
  },
});


const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png|pdf|avif|webp|svg/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("File type not supported. Please upload JPG, PNG, WEBP, or SVG."));
  }
};
const upload = multer({ storage, fileFilter });

module.exports = upload;
