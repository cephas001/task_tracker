const crypto = require("crypto");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");

require("dotenv").config({ path: "../config/config.env" });

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  service: "Gmail",
  auth: {
    user: "tasktracker01@gmail.com",
    pass: "agkb skrx mvdl qhtw",
  },
});

const emailService = async (res, email) => {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  const ttl = 2 * 60 * 1000;
  const expires = Date.now() + ttl;
  const stringToHash = `${email}.${otp}.${expires}`;
  const hashOtp = crypto
    .createHmac("sha256", process.env.SECRET_KEY)
    .update(stringToHash)
    .digest("hex");
  const fullHash = `${hashOtp}.${expires}`;

  var mailOptions = {
    to: email,
    subject: "Your Task Tracker Code ",
    html:
      "<h3>Enter this OTP pin to validate your account: </h3>" +
      "<h1 style='font-weight:bold;'>" +
      otp +
      "</h1>",
    text:
      "<h3>Enter this OTP pin to validate your account: </h3>" +
      "<h1 style='font-weight:bold;'>" +
      otp +
      "</h1>",
  };

  try {
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.json({message: "Error sending OTP", sent: false});
      }
      res.json({ message: "Enter OTP pin", fullHash, email, sent: true});
    });
  } catch(err) {
    res.status(500).json({message: "Problem with server"})
  }
  
};

const emailServiceContact = async (res, info) => {
  const { email, title, body } = info;
  var mailOptions = {
    to: "tasktracker01@gmail.com",
    subject: `You have received a message from ${email}`,
    html: `<h1>Title:</h1> ${title} <br /> <h1>Message body:</h1> <br /> ${body}`,
    text: `Title: ${title} ||| Message body: ${body}`,
  };

  try {
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.json({message: "Error sending email", sent: false});
      }
      res.json({ message: "Email has been sent successfully", sent: true});
    });
  } catch(err) {
    res.status(500).json({message: "Problem with server"})
  }
}

module.exports = {
  emailService, 
  emailServiceContact
};

