import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Garante que as pastas existam
if (!fs.existsSync("./uploads")) fs.mkdirSync("./uploads");
if (!fs.existsSync("./data")) fs.mkdirSync("./data");
if (!fs.existsSync("./data/reports.json"))
  fs.writeFileSync("./data/reports.json", "[]");

// Configuração do multer (armazenamento local)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Função auxiliar para ler e salvar dados JSON
const readReports = () =>
  JSON.parse(fs.readFileSync("./data/reports.json", "utf8"));
const saveReports = (data) =>
  fs.writeFileSync("./data/reports.json", JSON.stringify(data, null, 2));

// Rota de teste
app.get("/", (req, res) => {
  res.send("Servidor ObraLink rodando 🚧");
});

// ✅ Rota para receber relatórios
app.post("/api/reports", upload.array("fotos"), (req, res) => {
  try {
    const { obra, descricao, data } = req.body;
    const fotos = req.files.map((file) => file.path);

    if (!obra || !descricao || !data) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }

    const reports = readReports();

    const novo = {
      id: reports.length + 1,
      obra,
      descricao,
      data,
      fotos,
      criadoEm: new Date().toISOString(),
    };

    reports.push(novo);
    saveReports(reports);

    res
      .status(201)
      .json({ message: "Relatório salvo com sucesso!", report: novo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao salvar relatório" });
  }
});

// ✅ Rota para listar relatórios
app.get("/api/reports", (req, res) => {
  const reports = readReports();
  res.json(reports);
});

// ✅ Rota para visualizar uma foto
app.get("/api/fotos/:nome", (req, res) => {
  const caminho = path.join(process.cwd(), "uploads", req.params.nome);
  res.sendFile(caminho);
});

app.listen(PORT, () =>
  console.log(`Servidor rodando em http://localhost:${PORT}`)
);
