import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { createServer } from "http"; // Node HTTP server for Express + WebSocket
import { WebSocketServer } from "ws"; // WebSocket server for streaming reinforcement
import { EidosStore } from "../storage/symbolicStore";
import { RedisStore } from "../storage/redisStore";
import { SQLiteStore } from "../storage/sqliteStore";
import { MemoryStore } from "../storage/memoryStore";
import type { StorageAdapter } from "../storage/storageAdapter";
import type { SemanticIdea } from "../core/symbolicTypes";

const app = express();

const storageType = process.env.EIDOS_STORAGE || "memory";
let adapter: StorageAdapter;
switch (storageType) {
  case "redis":
    adapter = new RedisStore();
    break;
  case "sqlite":
    adapter = new SQLiteStore();
    break;
  default:
    adapter = new MemoryStore();
}

const store = new EidosStore(adapter);
store
  .load()
  .then(() => console.log("🧠 Memória simbólica carregada do disco."));

app.use(cors());
app.use(bodyParser.json());

// Limitador de taxa para evitar abuso: 100 requisições por minuto por IP
const limiter = rateLimit({
  windowMs: 60 * 1000, // Janela de 1 minuto
  max: 100, // Máximo de 100 requisições por IP
  standardHeaders: true, // Usa cabeçalhos RateLimit-*
  legacyHeaders: false, // Desativa cabeçalhos X-RateLimit-*
});

app.use(limiter);

// Rota para consulta por v com seletores simbólicos
app.get("/query", async (req, res) => {
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

  const result = await store.query(w, c, { context, tags, metadata });
  res.json(result);
});

// Inserção de novo ponto
// Permite campo opcional `ttl` (ms) para expirar automaticamente a ideia
app.post("/insert", async (req, res) => {
  const data: SemanticIdea = req.body;
  if (!data.id || typeof data.w !== "number" || typeof data.r !== "number") {
    return res.status(400).send("Invalid DataPoint format");
  }

  await store.insert(data);
  res.sendStatus(201);
});

// Tick de decaimento
app.post("/tick", async (_req, res) => {
  await store.tick();
  res.send("Tick applied");
});

// Reforço de ponto
app.post("/reinforce", async (req, res) => {
  const { id, factor } = req.body;
  if (!id) return res.status(400).send("Missing 'id'");
  await store.reinforce(id, factor || 1.1);
  res.send("Reinforced");
});

// Dump/Snapshot da memória atual
app.get("/dump", async (_req, res) => {
  const snap = await store.snapshot();
  res.json(snap);
});

// Restaura o estado da memória a partir de um snapshot enviado
app.post("/restore", async (req, res) => {
  const snapshot: SemanticIdea[] = req.body;
  if (!Array.isArray(snapshot)) {
    return res.status(400).send("Invalid snapshot format");
  }
  await store.restore(snapshot);
  res.send("Snapshot restored");
});

// Salvar
app.post("/save", async (_req, res) => {
  await store.save();
  res.send("Saved to disk");
});

// Carregar
app.post("/load", async (_req, res) => {
  await store.load();
  res.send("Loaded from disk");
});

//Criação de servidor HTTP para anexar WebSocket ao Express
const server = createServer(app);

// Servidor WebSocket para reforço baseado em fluxo
// Clientes enviam mensagens JSON `{ id: string, factor?: number }`
const wss = new WebSocketServer({ server, path: "/reinforce-stream" });
wss.on("connection", (socket) => {
  // Lidar com eventos de reforço de entrada
  socket.on("message", async (data) => {
    try {
      const { id, factor } = JSON.parse(data.toString());
      if (typeof id !== "string") {
        socket.send(JSON.stringify({ error: "Missing id" }));
        return;
      }
      // Aplicar reforço usando fator fornecido ou padrão
      await store.reinforce(id, typeof factor === "number" ? factor : 1.1);
      socket.send(JSON.stringify({ status: "ok" }));
    } catch (err) {
      // Notificar o cliente sobre cargas malformadas ou erros internos
      socket.send(
        JSON.stringify({ error: (err as Error).message || "Invalid payload" })
      );
    }
  });
});

// Start HTTP + WebSocket server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🧠 EidosDB API listening on http://localhost:${PORT}`);
});
