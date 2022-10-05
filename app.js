const express = require("express");
const router = express.Router();
//const { dirname } = require("path/posix")
const app = express();
const PORT = process.env.PORT || 3000;
const multer = require("multer");
const upload = multer();
const ejs = require("ejs");

//const assert = require("assert/strict");

// mongo db database
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const databaseName = "players";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbname: databaseName,
};
const uri = process.env.DB_URI;

const database = mongoose.connection;
database.on("error", console.error.bind(console, "connection error:"));
database.once("open", function () {
  console.log(`DAtabase connection established`);
});
app.listen(PORT, console.log(" server listening on port"+ PORT));

// views Engine setup

app.set(`view engine`, ejs);
app.set(`views`, __dirname + "/views");
/*app.set(`views`, __dirname + "/views"); r */

//rapp.use(express.static("public"));

app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(upload.array());
//ROUTES
//HOME PAGE

app.get("/about", (req, res, next) => {
  res.sendFile(__dirname + "/public/index.html");
});
app.get("/", (req, res, next) => {
    res.sendFile(__dirname + "/public/landing.html");
  });
