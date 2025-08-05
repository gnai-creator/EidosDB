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

// Rota para consulta por v com seletores simbólicos
app.get("/query", (req, res) => {
  const w = parseFloat(req.query.w as string);
  if (isNaN(w)) return res.status(400).send("Missing or invalid 'w'");

  const c = req.query.c ? parseFloat(req.query.c as string) : undefined;
  const context = req.query.context as string | undefined;

  const tagsParam = req.query.tags as string | undefined;
  const tags = tagsParam
    ? tagsParam
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
    : undefined;

  const metadataParam = req.query.metadata as string | undefined;
  let metadata: Record<string, any> | undefined;
  if (metadataParam) {
    try {
      metadata = JSON.parse(metadataParam);
    } catch {
      return res.status(400).send("Invalid 'metadata' JSON");
    }
  }

  const result = store.query(w, c, { context, tags, metadata });
  res.json(result);
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
