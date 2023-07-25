const express = require("express");
const path = require("path");

const {
  registerUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controller/user");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "/client/public/images"));
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post("/register", upload.single("file"), registerUser);

router.get("/users", getUsers);

router.get("/users/:id", getUser);

router.put("/users/:id", upload.single("file"), updateUser);

router.delete("/users/:id", deleteUser);

module.exports = router;
