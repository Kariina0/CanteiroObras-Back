// routes/reportRoutes.js
import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import Report from "../models/Report.js";

const router = express.Router();

// Multer: destino e nome dos arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const obraName = req.body.obra ? req.body.obra.replace(/\s+/g, "-") : "obra";
    const uniqueName = `${obraName}-${Date.now()}-${Math.floor(Math.random() * 1000)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// POST: salvar relatório
router.post("/", upload.array("fotos", 10), async (req, res) => {
  try {
    const { data, obra, descricao } = req.body;
    if (!data || !obra || !descricao)
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });

    const fotos = req.files ? req.files.map(f => f.path) : [];

    const novoRelatorio = new Report({ data, obra, descricao, fotos });
    await novoRelatorio.save();

    res.status(201).json({ message: "Relatório salvo com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao salvar relatório", error });
  }
});

// GET: listar relatórios com URLs completas
router.get("/", async (req, res) => {
  try {
    const relatorios = await Report.find().sort({ criadoEm: -1 }).lean();
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT}`;
    relatorios.forEach(r => {
      r.fotos = r.fotos.map(f => `${baseUrl}/${f.replace(/\\/g, "/")}`);
    });
    res.status(200).json(relatorios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao listar relatórios", error });
  }
});

export default router;
