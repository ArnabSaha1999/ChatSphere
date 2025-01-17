import Message from "../models/MessageModel.js";
import { mkdirSync, renameSync } from "fs";
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

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send("File is required!");
    }
    const date = Date.now();
    const fileDir = `uploads/files/${date}`;
    let fileName = `${fileDir}/${req.file.originalname}`;
    mkdirSync(fileDir, { recursive: true });
    renameSync(req.file.path, fileName);
    return res.status(200).json({ filePath: fileName });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal Server Error!");
  }
};
