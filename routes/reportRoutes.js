import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import Report from "../models/Report.js";

const router = express.Router();

// Configuração Multer para upload de fotos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// POST /api/reports - salvar relatório com fotos
router.post("/", upload.array("fotos", 5), async (req, res) => {
  try {
    const { data, obra, descricao, status } = req.body;

    // Validação obrigatória
    if (!data || !obra || !descricao) {
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    const fotos = req.files ? req.files.map((f) => f.path) : [];

    const novoRelatorio = new Report({ data, obra, descricao, status, fotos });
    await novoRelatorio.save();

    res.status(201).json({ message: "Relatório salvo com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao salvar relatório", error });
  }
});

// GET /api/reports - listar relatórios
router.get("/", async (req, res) => {
  try {
    const relatorios = await Report.find().sort({ criadoEm: -1 });
    res.status(200).json(relatorios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao listar relatórios", error });
  }
});

export default router;
