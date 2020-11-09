const Mongoose = require("mongoose");

const repairstatusSchema = new Mongoose.Schema(
  {
    repairid: {
      type: Mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Task",
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

module.exports = Mongoose.model("Repairstatus", repairstatusSchema);
