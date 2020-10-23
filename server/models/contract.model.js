const Mongoose = require("mongoose");

const contractSchema = new Mongoose.Schema(
  {
    charge: {
      type: Number,
      required: true,
    },
    rent: {
      type: Number,
      required: true,
    },
    tenant: {
      type: Mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Tenant",
    },
    appartmentid: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Appart",
    },
    buildingid: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Building",
    },
    other: {
      type: String,
    },
    status: {
      type: String,
      default: "Actif",
    },
    createdBy: {
      type: Mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Owner",
    },
  },
  { timestamps: true }
);

module.exports = Mongoose.model("Contract", contractSchema);
