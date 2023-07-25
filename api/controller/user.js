const bcrypt = require("bcrypt");
const User = require("../models/user");

function isEmail(email) {
  var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (email !== "" && email.match(emailFormat)) {
    return true;
  }

  return false;
}

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, cpassword, userName } =
    JSON.parse(req.body.data);

  const file = req.file;

  try {
    if (password !== cpassword) {
      return res
        .status(403)
        .json({ status: "failed", message: "password not match" });
    }

    const exist = await User.findOne({ $or: [{ email: email }, { userName }] });

    if (exist) {
      return res.status(400).json({
        status: "failed",
        message: "User already exists",
      });
    }

    if (firstName && lastName && userName && email && password === cpassword) {
      const hashPwd = await bcrypt.hash(password, +process.env.PWD_SALT);

      const validEmail = isEmail(email);

      if (!validEmail) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid email please enter proper email",
        });
      }

      await User.create({
        firstName,
        lastName,
        email,
        userName,
        profile: file ? file.originalname : null,
        password: hashPwd,
      });

      return res
        .status(200)
        .json({ status: "success", message: "Successfully user registered!" });
    } else {
      return res
        .status(400)
        .json({ status: "failed", message: "Miising fileds" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "error", message: "internal server error" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    return res.status(200).json({ status: "success", data: users });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "failed", message: "internal server error" });
  }
};

const getUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const users = await User.findById(userId).select("-password");

    return res.status(200).json({ status: "success", data: users });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "failed", message: "internal server error" });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;

  const { firstName, lastName } = JSON.parse(req.body.data);

  const file = req.file;
  console.log(file);
  try {
    if (file != null || firstName !== "" || lastName !== "") {
      const users = await User.findByIdAndUpdate(
        userId,
        {
          firstName: firstName,
          lastName: lastName,
          profile: file?.originalname,
        },
        {
          new: true,
        }
      );
      console.log(users);

      return res
        .status(200)
        .json({ status: "success", message: "user updated successfully" });
    } else {
      return res
        .status(400)
        .json({ status: "failed", message: "Miising fileds" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "failed", message: "internal server error" });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    if (userId) {
      const users = await User.findByIdAndDelete(userId);
      console.log(users);
      return res
        .status(200)
        .json({ status: "success", message: "user deleted successfully" });
    } else {
      return res
        .status(400)
        .json({ status: "failed", message: "Miising user id" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "failed", message: "internal server error" });
  }
};

module.exports = {
  registerUser,
  getUsers,
  getUser,
  deleteUser,
  updateUser,
};
