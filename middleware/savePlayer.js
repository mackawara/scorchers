const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");
const assert = require("assert");

const playerSchema = new mongoose.Schema(
  {
    nameChild: {
      type: String,
      required: [true, `Name is required,Please enter!`],
      minlength: [2, `please enter a valid name`],
      maxlength: [50, `please enter a valid name`],
    },
    dob: {
      type: [Date, `Please check yor DOB and ensure it is correct`],
      required: [true, "Please enter DOB"],
    },
    health: {
      type: [String, `Please enter valid text `],
      required: [false, "Please enter DOB"],
    },

    school: {
      type: String,
      required: [true, `Please select School from drop-down list`],
      maxlength: [30, "Please keep Subject to within 30 characters"],
    },
    address: {
      type: String,
      required: [true, `Please enter your Address`],
    },
    surburb: {
      type: String,
      required: [
        true,
        `Please select your Suburb /location from the drop down list`,
      ],
      maxlength: [30, "Invalid address"],
    },

    parentName: {
      type: String,
      required: [true, `Please enter a valid(parent) name`],
      minlength: [2, `please enter a valid name`],
      maxlength: [50, `please enter a valid name`],
      //match: [/^[a-z ,.'-]+$/ , " Name contains Invalid characters"],
    },
    contact: {
      type: String,
      required: [true, `Mobile Number is required`],
      minlength: [10, `Mobile Number is too short`],
      maxlength: [13, `Mobile Number is too long `],
      validate: {
        validator: function (v) {
          return /^(\+263|0)7[7-8|1|3][0-9]{7}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid mobile number`,
      },
    },

    email: {
      unique: [true, `This is email is already in use`],
      type: String,
      required: true,
      lowercase: true,
      validate: {
        validator: async function (email) {
          const user = await this.constructor.findOne({ email });
          if (user) {
            if (this.id === user.id) {
              return true;
            }
            return false;
          }
          return true;
        },
        message: (props) => "The specified email address is already in use.",
      },
    },
  },

  { timestamps: true }
);

const playerModel = mongoose.model("player", playerSchema);

let savePlayerToDb = async (req, res, next) => {
  console.log("save to database is working");
  const nameChild = req.body.nameChild;
  const dob = req.body.dob;
  const email = req.body.email;
  const parentName = req.body.parentName;
  const address = req.body.address;
  const contact = req.body.contact;
  const school = req.body.school;
  const surburb = req.body.surburb;
  const health = req.body.health;

  const player = new playerModel({
    nameChild: nameChild,
    dob: dob,
    address: address,
    surburb: surburb,
    school: school,
    parentName: parentName,
    contact: contact,
    email: email,
    health: health,
  });

  const queryPlayer = async function () {
    console.log(`query player is working`);
    const result = await playerModel
      .find({
        nameChild: nameChild,
        surburb: surburb,
        dob: dob,
      })
      .exec();
    console.log(result);

    if (result.length < 1) {
      console.log(" test passed");
      savePlayer();
      next();
    } else {
      res.status(500).send({
        response: `${nameChild} is already registered. Please use another email`,
      });
    }
  };
  async function savePlayer() {
    console.log(`save player working `);
    try {
      player.save((err, player) => {
        if (err) {
          const errors = err.errors;

          res.status(422).send(errors);
          return;
        } else {
          next();
          console.log("save successfully");
        }
      });
    } catch (error) {
      console.log(error, player);
    }
  }

  queryPlayer();
};

module.exports = { savePlayerToDb, playerModel };
