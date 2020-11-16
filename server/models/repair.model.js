const Mongoose = require("mongoose");

const repairSchema = new Mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: Mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Status",
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
    file: [{ type: String }],
    createdBy: {
      type: Mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Owner",
    },
  },
  { timestamps: true }
);

module.exports = Mongoose.model("Repair", repairSchema);
