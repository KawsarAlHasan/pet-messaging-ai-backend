import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import userRouter from "./routes/user.route.js";
import forgotPasswordRoute from "./routes/forgot.password.route.js";

import petTypeRoute from "./routes/pet.type.route.js";
import petRoute from "./routes/pet.route.js";

import settingsRoute from "./routes/settings.route.js";

const app = express();

// Middlewares and cors
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());

// Serve static files
app.use("/public", express.static(path.join(__dirname, "../public")));

// // Routers
app.use("/api/v1/user", userRouter);
app.use("/api/v1/forgot-password", forgotPasswordRoute);

app.use("/api/v1/pet", petRoute);
app.use("/api/v1/pet-type", petTypeRoute);

app.use("/api/v1/setting", settingsRoute);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// wrong route handler
app.use("/", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
