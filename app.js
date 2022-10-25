const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const multer = require("multer");
const upload = multer();
const ejs = require("ejs");

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
const uri = process.env.MONGOBD_URI;
try {
  let connection = mongoose.connect(process.env.MONGODB_URI || uri, options);
  const database = mongoose.connection;
  database.on("error", console.error.bind(console, "connection error:"));
  database.once("open", function () {
    console.log(`DAtabase connection established`);
  });
} catch (error) {
  console.log(" database could not be connected");
}
// views Engine setup

app.set(`view engine`, ejs);
app.set(`views`, __dirname + "/views");
/*app.set(`views`, __dirname + "/views"); r */

//rapp.use(express.static("public"));

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(upload.array());
//ROUTES
//HOME PAGE
app.get("/landing", (req, res, next) => {
  console.log("test");
  console.log(" home sectin");
  res.sendFile(__dirname + "/public/landing.html");
});
app.get("/about", (req, res, next) => {
  console.log(" about sectin");
  res.sendFile(__dirname + "/public/index.html");
});

const { validationRules, validatePlayer } = require("./middleware/validation");

const { savePlayerToDb, playerModel } = require("./middleware/savePlayer");
const formatted = {};
app.get("/registration", (req, res, next) => {
  console.log(" registration sectin");
  res.sendFile(__dirname + "/public/registration.html");
});

app.get("/whatsapp", (req, res) => {
  console.log(req.query);
  /**
   * UPDATE YOUR VERIFY TOKEN
   *This will be the Verify Token value when you set up webhook
   **/
  const verify_token = process.env.VERIFY_TOKEN;

  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let hookToken = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && hookToken) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && hookToken === verify_token) {
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

app.post(
  "/registration",
  validationRules(),
  validatePlayer,
  savePlayerToDb,
  (req, res, next) => {
    res.render("regSuccess.ejs", { player: req.body });
    /* res.status(200).send("Registration successfuly received"); */
  }
);
app.listen(PORT, console.log(" server listening on port" + PORT));
