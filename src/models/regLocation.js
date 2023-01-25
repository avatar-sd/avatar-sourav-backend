const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RegLocationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "UserCred",
      required: true,
    },
    location: {
      type: { type: String, enum: "Point", default: "Point" },
      coordinates: { type: Array, default: [0, 0] },
    }
  },
  { timestamps: true }
);
RegLocationSchema.index({ location: "2dsphere" });
module.exports = mongoose.model("RegLocations", RegLocationSchema);
