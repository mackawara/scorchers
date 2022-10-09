const { body, validationResult } = require("express-validator");

const validationRules = () => {
  return [
    body("nameChild", "Please a enter a valid name")
      .not()
      .isEmpty()
      .isLength({ min: 2 })
      .trim()
      .escape(),
    body("parentName", "Please a enter a valid name")
      .not()
      .isEmpty()
      .isLength({ min: 2, max: 35 })
      .trim()
      .escape(),
    body("school", "Please select your child`s school")
      .not("Select One")
      .trim()
      .escape(),

    body("dob", "Please select a valid DOB from the calendar")
      .not()
      .isEmpty()
      .isDate()
      .trim()
      .escape(),

    body("email")
      .not()
      .isEmpty()
      .withMessage("Please enter a valid Email")
      .isEmail()
      .withMessage("Email entered is not a valid email address ")
      .normalizeEmail()
      .trim()
      .escape(),
    body("contact")
      .not()
      .isEmpty()
      .withMessage(`Mobile number is required`)
      .isLength({ min: 10, max: 13 })
      .isNumeric()
      .withMessage(`Ensure your mobile number has no invalid characters`)
      .isMobilePhone()
      .withMessage(`Ensure you entered a valid Mobile number`)
      .trim()
      .escape(),
    body("surburb", "Ensure you select your location/surburb")
      .not("Select One")
      .trim()
      .escape(),

    body("address")
      .not()
      .isEmpty()
      .withMessage(`Address is required`)
      .isLength({ min: 2 })
      .withMessage(`Check if your address is complete`)
      .trim()
      .escape(),
    body("health").trim().escape(),
  ];
};
const validatePlayer = (req, res, next) => {
  const result = validationResult(req);

  const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
      return {
        message: error.msg,
      };
    },
  });
  const errors = myValidationResult(req);
  if (!result.isEmpty()) {
    const formatted = errors.mapped();
    const arr = [];
    for (const error in formatted) {
      const element = formatted[error];
      arr.push(element);
      console.log(element);
    }

    console.log(arr);
    res.status(422).render("regErr.ejs", { arr });

    //next() // to be removed

    //return res.json({ errors: sresult.array() });
  } else {
    console.log("Validation passed");

    return next();
  }
};

module.exports = { validationRules, validatePlayer };
