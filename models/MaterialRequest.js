import mongoose from "mongoose";

const materialRequestSchema = new mongoose.Schema({
  obra: { type: String, required: true },
  material: { type: String, required: true },
  quantidade: { type: Number, required: true },
  dataDesejada: { type: String, required: true },
  observacoes: { type: String },
  status: { type: String, default: "Pendente" },
  criadoEm: { type: Date, default: Date.now },
});

export default mongoose.model("MaterialRequest", materialRequestSchema);
