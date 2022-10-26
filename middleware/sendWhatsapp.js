const axios = require("axios").default;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_BUSINESS_ID = process.env.WHATSAPP_BUSINESS_ID;
const sendWhatsapp = (receiver, message) => {
  axios({
    method: "POST",
    url:
      "https://graph.facebook.com/v13.0/" +
      WHATSAPP_PHONE_NUMBER_ID +
      "/messages?access_token=" +
      WHATSAPP_TOKEN,
    data: {
      messaging_product: "whatsapp",
      to: receiver,
      text: {
        body:
          "*Do not reply: This is an Automated message , send replies to 00263775231426* " +
          message,
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};
module.exports = sendWhatsapp;
