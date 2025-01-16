import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getMessages } from "../controllers/MessageControllers.js";

const messageRoutes = Router();

messageRoutes.post("/get-messages", verifyToken, getMessages);

export default messageRoutes;
