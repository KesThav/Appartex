const Mongoose = require("mongoose");

const taskSchema = new Mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      default: "Créé",
    },
    messageid: {
      type: Mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Message",
    },
    createdBy: {
      type: Mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Owner",
    },
  },
  { timestamps: true }
);

module.exports = Mongoose.model("Task", taskSchema);
