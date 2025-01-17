import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getMessages, uploadFile } from "../controllers/MessageControllers.js";
import multer from "multer";

const upload = multer({ dest: "uploads/files" });

const messageRoutes = Router();

messageRoutes.post("/get-messages", verifyToken, getMessages);
messageRoutes.post(
  "/upload-file",
  verifyToken,
  upload.single("file"),
  uploadFile
);

export default messageRoutes;
