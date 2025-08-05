import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { EidosStore } from "../storage/symbolicStore";
import type { SemanticIdea } from "../core/symbolicTypes";

const app = express();
const store = new EidosStore();
store.load();
console.log("🧠 Memória simbólica carregada do disco.");

app.use(cors());
app.use(bodyParser.json());

// Rota para consulta por v
app.get("/query", (req, res) => {
  const w = parseFloat(req.query.w as string);
  if (isNaN(w)) return res.status(400).send("Missing or invalid 'w'");

  const result = store.query(w);
  res.json(result);
});

// Rota simbólica com filtro por metadata
app.get("/query-simbolica", (req, res) => {
  const w = parseFloat(req.query.w as string);
  if (isNaN(w)) return res.status(400).send("Missing or invalid 'w'");

  // Extração dos filtros opcionais
  const filtroTipo = req.query.tipo as string | undefined;
  const filtroEmocao = req.query.emoção as string | undefined;
  const filtroOrigem = req.query.origem as string | undefined;
  const filtroRelacao = req.query.relação as string | undefined;

  // Avaliar e ordenar por v
  const avaliados = store.query(w);

  // Aplicar filtros simbólicos
  const filtrados = avaliados.filter((p) => {
    const m = p.metadata ?? {};

    if (filtroTipo && m.tipo !== filtroTipo) return false;
    if (filtroOrigem && m.origem !== filtroOrigem) return false;
    if (filtroEmocao && !m.emoções?.includes(filtroEmocao)) return false;
    if (filtroRelacao && !m.relações?.includes(filtroRelacao)) return false;

    return true;
  });

  res.json(filtrados);
});

// Inserção de novo ponto
app.post("/insert", (req, res) => {
  const data: SemanticIdea = req.body;
  if (!data.id || typeof data.w !== "number" || typeof data.r !== "number") {
    return res.status(400).send("Invalid DataPoint format");
  }

  store.insert(data);
  res.sendStatus(201);
});

// Tick de decaimento
app.post("/tick", (_req, res) => {
  store.tick();
  res.send("Tick applied");
});

// Reforço de ponto
app.post("/reinforce", (req, res) => {
  const { id, factor } = req.body;
  if (!id) return res.status(400).send("Missing 'id'");
  store.reinforce(id, factor || 1.1);
  res.send("Reinforced");
});

// Dump da memória
app.get("/dump", (_req, res) => {
  res.json(store.dump());
});

// Salvar
app.post("/save", (_req, res) => {
  store.save();
  res.send("Saved to disk");
});

// Carregar
app.post("/load", (_req, res) => {
  store.load();
  res.send("Loaded from disk");
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🧠 EidosDB API listening on http://localhost:${PORT}`);
});
