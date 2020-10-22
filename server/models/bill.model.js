const Mongoose = require("mongoose");

const billSchema = new Mongoose.Schema(
  {
    tenant: {
      type: Mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Tenant",
    },
    endDate: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "A venir",
    },
    createdBy: {
      type: Mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Owner",
    },
  },
  { timestamps: true }
);

module.exports = Mongoose.model("Bill", billSchema);
