var nodemailer = require("nodemailer");
var defaultConfig = require("../config/defaultConfig");

var transporter = nodemailer.createTransport({
  // host: process.env.MAIL_HOST,
  // port: process.env.MAIL_PORT,
  // secure: process.env.SECURE,
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // user: process.env.MAIL_USER,
    // pass: process.env.MAIL_PSD
    user: defaultConfig[defaultConfig.env].gmailId,
    pass: defaultConfig[defaultConfig.env].gmailPassword,
  },
});

const sendWelcomeEmail = (email, name) => {
  try {
    var mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Welcome",
      html: "<h2>hii " + name + "</h2><p>Welcome to Sanyog</p>",
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (e) {
    console.log(e)
  }
};

const sendOtpInMail = (email, otp) => {
  try {
    var mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Yarifi - Otp",
      html: "<p>" + otp + " is your yarifi verification code.</p>",
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        // console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (e) {
    // console.log(e)
  }
};

const resetPasswordInMail = (email, url) => {
  try {
    var mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "reset password",
      html: "<p>Want to reset your password? <a>" + url + "</a></p>",
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (e) {
    console.log(e)
  }
};

module.exports = {
  sendWelcomeEmail,
  sendOtpInMail,
  resetPasswordInMail
};
