import express from "express";
import MaterialRequest from "../models/MaterialRequest.js";

const router = express.Router();

// POST /api/materials - criar solicitação
router.post("/", async (req, res) => {
  try {
    const { obra, material, quantidade, dataDesejada, observacoes } = req.body;

    if (!obra || !material || !quantidade || !dataDesejada) {
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    const novaSolicitacao = new MaterialRequest({
      obra,
      material,
      quantidade,
      dataDesejada,
      observacoes,
    });

    await novaSolicitacao.save();
    res.status(201).json({ message: "Solicitação criada com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar solicitação", error });
  }
});

// GET /api/materials - listar solicitações
router.get("/", async (req, res) => {
  try {
    const solicitacoes = await MaterialRequest.find().sort({ criadoEm: -1 });
    res.status(200).json(solicitacoes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao listar solicitações", error });
  }
});

export default router;
