![EidosDB Logo](./eidosdb/assets/EidosDB_Transparent.png)
![License](https://img.shields.io/badge/license-CC--BY--NC%204.0-blue)
![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Docker](https://img.shields.io/badge/docker-ready-blue)
# EidosDB

**EidosDB** — *The Symbolic Memory Engine for Next‑Gen AI*

---

## 🌟 What is EidosDB?

EidosDB is a novel memory engine that combines symbolic reasoning with semantic embeddings and temporal dynamics. Instead of merely storing data, it treats each idea as a living entity that *remembers, decays, and adapts* based on use.

Think of it as a **cognitive layer**—a memory that fades, reinforces, and ranks thoughts based on context and intensity.

---

## 🧬 How It’s Different

EidosDB is not just a vector store — it’s a **cognitive substrate** for symbolic AI.

Unlike Pinecone, Weaviate, or RedisVector, it combines:

- **Semantic memory** (via embeddings)
- **Symbolic reasoning** (via dynamic metadata, intention, and decay)
- **Temporal dynamics** (ideas evolve, fade, and strengthen)
- **Contextual and symbolic filtering**, beyond cosine similarity
- **Presence score (`v`)** based on a physics-inspired model
- **Real-time reinforcement streams** for agents that learn over time

This makes EidosDB ideal for agents that need evolving symbolic knowledge, such as AGI prototypes, memory-based reasoning systems, and self-reflective assistants.

---

### 🧠 Symbolic Memory Comparison Table

| Feature                          | **EidosDB**                           | **Pinecone**                 | **Weaviate**                     | **RedisVector**            |
| -------------------------------- | ------------------------------------- | ---------------------------- | -------------------------------- | -------------------------- |
| **Data Type**                    | Symbolic ideas with vectors & context | Vectors only                 | Vectors + optional metadata      | Vectors with metadata      |
| **Symbolic Reasoning**           | ✅ Yes (intention, decay, presence)    | ❌ No                         | ❌ No                             | ❌ No                       |
| **Temporal Decay**               | ✅ Yes (per idea, with reinforcement)  | ❌ No                         | ⚠️ Limited (no decay by default) | ❌ No                       |
| **Presence Score (`v`)**         | ✅ Physics-inspired formula            | ❌ N/A                        | ❌ N/A                            | ❌ N/A                      |
| **Contextual Querying**          | ✅ Tags + context + symbolic filters   | ⚠️ Filters by namespace/tags | ✅ Filters supported              | ✅ Filters via metadata     |
| **Real-time Reinforcement**      | ✅ WebSocket + API-based               | ❌ No                         | ❌ No                             | ❌ No                       |
| **Embedding Storage**            | ✅ Custom or external                  | ✅ Yes                        | ✅ Built-in + external support    | ✅ External only            |
| **Storage Backend**              | Memory / JSON / Redis / SQLite        | Managed only                 | Local / Cloud / Customizable     | Redis only                 |
| **GraphQL Support**              | ✅ Optional                            | ❌ No                         | ✅ Native GraphQL                 | ❌ No                       |
| **Dashboard / Monitoring**       | Via eidosdb-frontend                  | ✅ Usage dashboard only       | ✅ Explorer UI                    | ⚠️ CLI/insights via Redis  |
| **Designed for AGI / Reasoning** | ✅ Core purpose                        | ❌ No                         | ❌ No                             | ❌ No                       |
| **License**                      | CC BY-NC 4.0 (open source)            | Commercial SaaS (closed)     | Open Source (Apache 2.0)         | Open Source (BSD 3-Clause) |

---

## 🔍 Key Features

* **Hybrid Symbolic Semantic Model**
  Every stored idea has:

  * a semantic embedding (vector),
  * a symbolic frequency (`w`),
 * a symbolic distance (`r`),
  * contextual metadata (e.g., emotion, origin, type),
  * and optional tags for symbolic grouping.

* **Physics-Inspired Presence Formula**

  ```ts
  v = (4 * w * r) / (π * √(1 − (w * r / c)²))
  ```

  This formula creates a “velocity-like” symbolic presence score (`v`) inspired by relativity.

* **Memory Behavior**

  * **Decay over time** (`tick()` lowers `w`)
  * **Reinforcement** (`reinforce(id)`) to boost an idea
  * **Symbolic expiration** through per-idea TTL
  * **Context-based filtering** and search

* **REST API Interface**
  Easily insert, query, decay, or reinforce memory via HTTP endpoints like `/insert`, `/query`, `/tick`, `/reinforce`.
* **Optional GraphQL endpoint**
  Expose the same operations via `/graphql` when enabled.

* **WebSocket reinforcement stream**
  Send real-time reinforcement events through `ws://localhost:3000/reinforce-stream` using JSON payloads.


* **API rate limiting & usage tracking**
  Requests are limited per API key and total daily usage is monitored.
  Keys that exceed the `USAGE_LIMIT` (default 10k requests/24h) are automatically
  blocked to prevent abuse.

* **Approximate Nearest Neighbor (ANN) index**
  Accelerated search for similar vectors using locality-sensitive hashing.

* **Lightweight Persistence**
  Default storage is in-memory + JSON file. Alternately supports pluggable store (e.g., Redis, SQLite).

* **Optional GPU Decay Loop**
  Weight decay can leverage GPU.js when installed, falling back to the CPU otherwise.

---

## 🧠 Why It Matters

EidosDB is ideal for:

* **AI agents with symbolic memory**: NPCs, chatbots, interactive systems that need long-term idea tracking.
* **Research in symbolic reasoning**: studies on decay, attention dynamics, and memory structures.
* **Personal knowledge systems**: evolving notes, thematic reminders, idea networks.
* **AGI prototypes**: symbolic-semantic hybrid cognition engines.

---

## 📦 Quickstart

1. Clone the repository
2. Run `npm install`
3. Execute the server:

   ```bash
   npx ts-node src/api/server.ts
   ```
4. Access API on [http://localhost:3000](http://localhost:3000)

Endpoints include:

* `POST /insert` → Insert an idea
* `GET /query?w=0.003&context=philosophy&tags=time` → Rank by symbolic presence with selectors
* `POST /tick` → Apply decay cycle
* `POST /reinforce` → Reinforce an idea
* `WS ws://localhost:3000/reinforce-stream` → Stream reinforcement events in JSON
* `GET /dump` → Dump memory snapshot
* `POST /restore` → Restore memory from a snapshot
* `GET /usage` → Check API key usage statistics

### API keys and tiers

All HTTP requests require an `x-api-key` header. Keys are grouped by user in
`eidosdb/data/api-keys.json`. Each user identifier (decoded from the JWT `sub`
or `email`) maps to its API keys and tiers.

Example of key file:

```json
{
  "user@example.com": {
    "basic-key": "free",
    "premium-key": "premium"
  }
}
```

Each tier controls the number of allowed requests per minute:

| Tier    | Limit (req/min) |
|---------|-----------------|
| basic   | 5               |
| premium | 1000            |

Use the key in requests:

```bash
curl -H "x-api-key: basic-key" http://localhost:3000/dump
```

A daily cap is controlled by the `USAGE_LIMIT` environment variable
(default: `10000`). When a key exceeds this limit within 24 hours it is
blocked automatically.

### GraphQL endpoint

Set the `EIDOS_GRAPHQL=true` environment variable to expose a GraphQL API at `/graphql` with a built-in GraphiQL playground.
Example:

```bash
EIDOS_GRAPHQL=true npx ts-node src/api/server.ts
```

Sample query:

```graphql
{
  ideas(w: 0.003, context: "philosophy") {
    id
    label
    v
  }
}
```

Sample mutation:

```graphql
mutation {
  insertIdea(
    input: {
      id: "alpha"
      label: "time is illusion"
      vector: [0.1]
      w: 0.002
      r: 2000
      context: "philosophy"
    }
  )
}
```

### Storage adapters

Set the `EIDOS_STORAGE` variable to `memory` (default), `redis`, or `sqlite` before starting the server.
To use Redis, install the package and run an available Redis server.
For SQLite, `npm install` compiles the `better-sqlite3` module without the need for an external service.

---

## 🐳 Docker Deployment

Run EidosDB in a container without installing Node.js locally.

```bash
./deploy.sh
```

The script builds the Docker image and starts the server on `http://localhost:3000`.

---

## ⚡ Optional GPU Acceleration

The decay loop can run on the GPU using [GPU.js](https://github.com/gpujs/gpu.js). Install the library and it will be used automatically:

```bash
npm install gpu.js
```

If GPU.js or compatible hardware is unavailable, the system falls back to the CPU implementation.

---

## 🧪 Example

```ts
const idea: SemanticIdea = {
  id: "alpha",
  label: "time is illusion",
  vector: [/* semantically generated */],
  w: 0.002,
  r: 2000,
  context: "philosophy",
  metadata: { emotion: "wonder", origin: "thought experiment" },
  tags: ["time", "concept"],
};
await api.post('/insert', idea);
```

To query memory presence with selectors:

```bash
GET /query?w=0.003&context=philosophy&tags=time
```

Returns a list of ideas sorted by `v` — the higher the `v`, the more present the idea is right now and matching the provided filters.

---

## 🧪 Tests

Run the Jest unit tests to verify symbolic behavior:

```bash
cd eidosdb
npm test
```

The test suite lives in the `tests/` folder and covers core utilities and the in‑memory store.

---

## 🧭 Roadmap & Contributions

We have a roadmap for enhancing EidosDB including:

* Integration with real semantic models for generating `vector`s
* Symbolic clustering, context-aware snapshots
* Real-time reinforcement streams, and more

We welcome contributors! See the `TODO.md` for high-level tasks and issue ideas.

---

## 📧 Contact & License

**Author**: Felipe Muniz – 2025
**License**: Distributed under the [Creative Commons Attribution-NonCommercial 4.0 International](LICENSE) license (CC BY-NC 4.0). You may use and share the code with attribution for non-commercial purposes.
Feel free to contribute or reach out via GitHub or email if you're interested in collaboration.

---

## 🚀 In Summary

EidosDB is **not just a database**—it’s a **memory engine for symbolic intelligence**. It models ideas as entities that *live, fade, and grow* within their context—opening new possibilities in cognitive AI and knowledge modeling.

Try it, experiment, and join the symbolic memory movement!

---

## 🌐 Join the Movement

We're building a new kind of memory — symbolic, semantic, temporal.

Join us:
- [Discord Server](https://discord.gg/N6c26QVf6U)
- [Roadmap: TODO.md](./TODO.md)
