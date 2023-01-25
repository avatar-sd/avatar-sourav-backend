const mongoose = require("mongoose");
const { errorCode } = require("../config/codeConfig");

const Schema = mongoose.Schema;

const userInfoSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "UserCred",
    },
    name: {
      type: String,
      trim: true,
    },
    img: {
      type: String,
    },
  },
  { timestamps: true }
);

const UserInfo = mongoose.model("UserInfo", userInfoSchema);

module.exports = UserInfo;
