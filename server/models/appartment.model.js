const Mongoose = require("mongoose");

const appartSchema = new Mongoose.Schema(
  {
    size: {
      type: Number,
      required: true,
    },
    adress: {
      type: String,
      default: null,
    },
    postalcode: {
      type: Number,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    building: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Building",
      default: null,
    },
    picture: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      default: "Libre",
    },
    createdBy: {
      type: Mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Owner",
    },
  },
  { timestamps: true }
);

module.exports = Mongoose.model("Appart", appartSchema);
