const multer = require("multer");
const { storage } = require("./cloudinaryConfig");

const upload = multer({ storage });

module.exports = upload;