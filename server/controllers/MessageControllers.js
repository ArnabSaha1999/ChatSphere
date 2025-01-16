import Message from "../models/MessageModel.js";

export const getMessages = async (req, res, next) => {
  try {
    const currentUserId = req.userId;
    const otherUserId = req.body.id;

    if (!currentUserId || !otherUserId) {
      return res.status(400).send("Both sender and recipient are required");
    }
    const messages = await Message.find({
      $or: [
        {
          sender: currentUserId,
          recipient: otherUserId,
        },
        {
          sender: otherUserId,
          recipient: currentUserId,
        },
      ],
    }).sort({ timestamp: 1 });

    return res.status(200).json({ messages });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal Server Error!");
  }
};
