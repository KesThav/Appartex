const Mongoose = require("mongoose");

const taskstatusSchema = new Mongoose.Schema(
  {
    taskid: {
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

module.exports = Mongoose.model("Taskstatus", taskstatusSchema);
