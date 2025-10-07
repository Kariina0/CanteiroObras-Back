// server.js
import express from "express";
import reportRoutes from "./routes/reportRoutes.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();

// CORS
app.use(cors({ origin: "http://localhost:5173" }));

// JSON no body
app.use(express.json());

// Uploads públicos
app.use("/uploads", express.static("uploads"));

// Rotas
app.use("/api/reports", reportRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Servidor rodando em http://localhost:${PORT}`)
);
