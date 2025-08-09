import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import app from "./src/app.js";
import { dbConnect } from "./src/config/db.connect.js";

dotenv.config();

// CORS configuration
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());

// database connection
dbConnect();

// server
const port = process.env.PORT || 8000;
const host = process.env.HOST || "localhost";

app.listen(port, host, () => {
  console.log(`Pet Messaging AI Server is running on http://${host}:${port}`);
});
