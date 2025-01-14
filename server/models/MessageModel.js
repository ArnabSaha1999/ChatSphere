import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: [true, "Message should have a sender"],
  },

  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: [true, "Message should have receiver"],
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
    fileURL: {
      type: String,
      required: function () {
        return this.messageType === "file";
      },
    },

    timestamp: {
      type: Date,
      defult: Date.now(),
    },
  },
});

export default mongoose.model("Message", messageSchema);
