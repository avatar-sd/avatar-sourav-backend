const mongoose = require("mongoose");
const { errorCode } = require("../config/codeConfig");

const Schema = mongoose.Schema;

const avatarInfoSchema = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "UserCred",
    },
    avatarPath: {
      type: String,
    },
    previewPath: {
      type: String,
    },
    type: {
      type: String,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const AvarInfo = mongoose.model("AvatarInfo", avatarInfoSchema);

module.exports = AvarInfo;
