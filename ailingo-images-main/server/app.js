import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from '../server/routes/authroute.js';

dotenv.config();
const app = express();

// Middlewares
app.use(cors({
  origin: "*"
}));


app.use(express.json());

// Connect MongoDB
connectDB();

// Routes

app.use("/api/auth", authRoutes); // includes upload-avatar route inside it


app.get("/", (req, res) => {
  res.send("API is working...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
