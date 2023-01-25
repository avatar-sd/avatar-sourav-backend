const mongoose = require("mongoose");
const defaultConfig = require("../config/defaultConfig");

const Schema = mongoose.Schema;

const regOtpSchema = new Schema({
  email: {
    type: String,
    trim: true,
    required: function () {
      return this.phone === undefined || this.phone === null;
    }
  },
  phone: {
    type: String,
    trim: true,
    required: function () {
      return this.email === undefined || this.email === null;
    }
  },
  otp: {
    type: String
  },
  attempt: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    expires: defaultConfig[defaultConfig.env].optTime,
    default: Date.now,
  },
});

module.exports = mongoose.model("RegOtps", regOtpSchema);
