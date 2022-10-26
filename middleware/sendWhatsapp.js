const axios = require("axios");
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_BUSINESS_ID = process.env.WHATSAPP_BUSINESS_ID;
const sendWhatsapp = (receiver, message) => {
  try {
    axios({
      method: "POST",
      url:
        "https://graph.facebook.com/v14.0/" +
        WHATSAPP_PHONE_NUMBER_ID +
        "/messages?access_token=" +
        WHATSAPP_TOKEN,
      data: {
        messaging_product: "whatsapp",
        to: receiver,
        text: {
          body:
            "*Do not reply: This is an Automated message , send replies to 0775231426* \n"+message + " \n *Powered by Venta Tech*"
        },
      },
      headers: { "Content-Type": "application/json" },
    }).then((data) => {
      console.log(data.status);
      return "Booking was saved , confirmation was also sent to your email";
    });
  } catch (error) {
    console.log(" error sending whatsapp");
  }
};
module.exports = sendWhatsapp;
