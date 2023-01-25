const mongoose = require("mongoose");
const { errorCode } = require("../config/codeConfig");

const Schema = mongoose.Schema;

const userCredSchema = new Schema(
  {
    userId: {
      type: String,
      trim: true,
    },
    userInfo: {
      type: Schema.Types.ObjectId,
      ref: "UserInfo",
      default: null,
    },
    googleId: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      default: 'user',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    metaId: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      minlength: 7,
      trim: true,
    },
  },
  { timestamps: true }
);
const UserCred = mongoose.model("UserCred", userCredSchema);

module.exports = UserCred;
