import express from "express";
import reportRoutes from "./routes/reportRoutes.js";
import materialRoutes from "./routes/materialRoutes.js"; // <-- importa antes de usar
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
connectDB();

const app = express(); // <-- app precisa ser declarado antes de usar

// Habilitar CORS
app.use(cors({ origin: "http://localhost:5173" }));

// Permitir JSON no body
app.use(express.json());

// Tornar a pasta uploads acessível
app.use("/uploads", express.static("uploads"));

// Rotas
app.use("/api/reports", reportRoutes);
app.use("/api/materials", materialRoutes); // <-- agora funciona porque app já existe

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Servidor rodando em http://localhost:${PORT}`)
);
