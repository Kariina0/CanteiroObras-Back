import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  data: { type: String, required: true },
  obra: { type: String, required: true },
  descricao: { type: String, required: true },
  status: { type: String, default: "Pendente" },
  fotos: [String], // caminhos das fotos
  criadoEm: { type: Date, default: Date.now },
});

export default mongoose.model("Report", reportSchema);
