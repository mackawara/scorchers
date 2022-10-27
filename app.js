const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const multer = require("multer");
const upload = multer();
const ejs = require("ejs");

//Whataspp Connections
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_BUSINESS_ID = process.env.WHATSAPP_BUSINESS_ID;

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
  let connection = mongoose.connect(uri, options);
  const database = mongoose.connection;

  database.on("error", console.error.bind(console, "There was an error:"));
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
const sendWhatsapp = require("./middleware/sendWhatsapp");

app.post("/whatsapp", (req, res) => {
  console.log(" message recieved")
  console.log(req.body)

  if (req.body.object) {
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      let phone_number_id =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
      let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
     sendWhatsapp(from, msg_body);
     
    }
    res.sendStatus(200);
  } else {
    // Return a '404 Not Found' if event is not from a WhatsApp API
    res.sendStatus(404);
  }
});

app.get("/whatsapp", (req, res) => {
  console.log(" test received");
  console.log(req.query);
  /**
   * UPDATE YOUR VERIFY TOKEN
   *This will be the Verify Token value when you set up webhook
   **/
  const verify_token = process.env.VERIFY_TOKEN;
  sendWhatsapp("263775231426", "thank you for your message");
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
  (req, res) => {
    const contact = "263" + req.body.contact.slice(-9);
    const nameChild = req.body.nameChild;
    const message = `Hi ${nameChild}, \n thank you for your registration to Scorchers Cricket, Welcome!!. Your details have been stored in the Scorchers Cricket database. \n
    Please visit our website scorchers.co.zw for information about us.
    See you at Megawatt school grounds on Saturday at 0830hrs for training \n
    Bring your water bottles for rehydration and remember to have fun `;
    sendWhatsapp(contact, message);
    res.redirect("/registrationSuccess");
    /* res.status(200).send("Registration successfuly received"); */
  }
);
app.get("/registrationSuccess", (req, res) => {
  res.render("registration.ejs");
});
app.listen(PORT, console.log(" server listening on port" + PORT));
