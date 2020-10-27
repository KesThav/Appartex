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
    reference: {
      type: String,
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
      type: Mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Status",
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
