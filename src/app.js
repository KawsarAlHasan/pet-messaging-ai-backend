import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRouter from "./routes/user.route.js";

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

app.get("/", (req, res) => {
  const date = new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" });
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🐾 Pet Messaging AI Server</title>
        <style>
            body {
                background: linear-gradient(135deg, #e0f7fa, #ffffff);
                font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
                text-align: center;
                padding: 50px;
                color: #173616;
            }
            h1 {
                font-size: 2.8rem;
                color: #2e7d32;
                margin-bottom: 10px;
            }
            h2 {
                font-size: 1.5rem;
                color: #388e3c;
                margin-top: 0;
            }
            p {
                font-size: 1.2rem;
                color: #555;
            }
            .status {
                display: inline-block;
                padding: 15px 30px;
                background-color: #4caf50;
                color: white;
                border-radius: 8px;
                font-weight: bold;
                margin: 20px 0;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                animation: pulse 1.5s infinite;
            }
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            footer {
                margin-top: 50px;
                font-size: 0.9rem;
                color: #777;
            }
        </style>
    </head>
    <body>
        <h1>🐾 Pet Messaging AI Server</h1>
        <h2>Beep-beep! The server is alive and kicking 🚀</h2>
        <div class="status">Server Status: <strong>Running</strong></div>
        <p>Current Server Time: <strong>${date}</strong></p>
        <footer>Powered by <b>Pet Messaging AI</b> | &copy; ${new Date().getFullYear()}</footer>
    </body>
    </html>
  `);
});

// wrong route handler
app.use("/", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
