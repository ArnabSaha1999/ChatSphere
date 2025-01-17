import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactRoutes from "./routes/ContactRoutes.js";
import setupSocket from "./socket.js";
import messageRoutes from "./routes/MessageRoutes.js";
import path from "path";
const __dirname = path.resolve();

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("upload/files"));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(port, () => {
  console.log(`Server is running at http//localhost:${port}`);
});

setupSocket(server);

mongoose
  .connect(databaseURL)
  .then((res) =>
    console.log(`MongoDB Connected! DB Host: ${res.connection.host}`)
  )
  .catch((err) => console.log(err.message));
