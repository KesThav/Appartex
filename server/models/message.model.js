const Mongoose = require("mongoose");

const messageSchema = new Mongoose.Schema(
  {
    sendedTo: {
      type: Mongoose.Schema.Types.ObjectId,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "non lu",
    },
    title: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = Mongoose.model("Message", messageSchema);
