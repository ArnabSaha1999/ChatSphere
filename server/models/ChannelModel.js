import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Channel name is required!"],
  },

  members: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  ],

  admin: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  messages: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Message",
      required: false,
    },
  ],

  createdAt: {
    type: Date,
    default: () => new Date(),
  },

  updatedAt: {
    type: Date,
    default: () => new Date(),
  },
});

channelSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

channelSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

export default mongoose.model("Channel", channelSchema);
