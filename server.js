import express from "express";
import reportRoutes from "./routes/reportRoutes.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();
connectDB();

const app = express();

// Permitir JSON no body
app.use(express.json());

// Tornar a pasta uploads acessível
app.use("/uploads", express.static("uploads"));

// Rotas
app.use("/api/reports", reportRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Servidor rodando em http://localhost:${PORT}`)
);
