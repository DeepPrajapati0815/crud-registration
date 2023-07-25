const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: { type: String, required: [true, "firstName is Required"] },
  lastName: { type: String, required: [true, "lastName is Required"] },
  email: { type: String, required: [true, "email is Required"], unique: true },
  userName: {
    type: String,
    required: [true, "userName is Required"],
    unique: true,
  },
  profile: { type: String },
  password: {
    type: String,
    required: [true, "password is Required"],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
