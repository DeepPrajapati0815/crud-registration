const express = require("express");
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const userRouter = require("./api/routes/user");
const { default: mongoose } = require("mongoose");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

(() => {
  try {
    mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("DB connection established");
  } catch (error) {
    console.log("DB not connected");
  }
})();

app.use(express.static(path.resolve(path.dirname(__filename), "build")));

app.use("/api", userRouter);

app.get("/*", function (req, res) {
  console.log("rendering");
  res.sendFile(path.join(path.dirname(__filename), "build", "index.html"));
});

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
