import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Message should have a sender"],
  },

  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },

  messageType: {
    type: String,
    enum: ["text", "file"],
    required: true,
  },

  content: {
    type: String,
    required: function () {
      return this.messageType === "text";
    },
  },
  fileURL: {
    type: String,
    required: function () {
      return this.messageType === "file";
    },
  },

  timestamp: {
    type: Date,
    default: () => new Date(),
  },
});

export default mongoose.model("Message", messageSchema);
