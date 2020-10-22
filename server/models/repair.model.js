const Mongoose = require("mongoose");

const repairSchema = new Mongoose.Schema(
  {
    Amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "en cours",
    },
    reason: {
      type: String,
      required: true,
    },
    taskid: {
      type: Mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Task",
    },
    createdBy: {
      type: Mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Owner",
    },
  },
  { timestamps: true }
);

module.exports = Mongoose.model("Repair", repairSchema);
