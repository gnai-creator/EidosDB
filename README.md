# EidosDB

**EidosDB** — *The Symbolic Memory Engine for Next‑Gen AI*

---

## 🌟 What is EidosDB?

EidosDB is a novel memory engine that combines symbolic reasoning with semantic embeddings and temporal dynamics. Instead of merely storing data, it treats each idea as a living entity that *remembers, decays, and adapts* based on use.

Think of it as a **cognitive layer**—a memory that fades, reinforces, and ranks thoughts based on context and intensity.

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

* **Approximate Nearest Neighbor (ANN) index**
  Accelerated search for similar vectors using locality-sensitive hashing.

* **Lightweight Persistence**
  Default storage is in-memory + JSON file. Alternately supports pluggable store (e.g., Redis, SQLite).

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
* `GET /dump` → Dump memory snapshot
* `POST /restore` → Restore memory from a snapshot

### Storage adapters

Set the `EIDOS_STORAGE` variable to `memory` (default), `redis`, or `sqlite` before starting the server.
To use Redis, install the package and run an available Redis server.
For SQLite, `npm install` compiles the `better-sqlite3` module without the need for an external service.

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

## 🧭 Roadmap & Contributions

We have a roadmap for enhancing EidosDB including:

* Integration with real semantic models for generating `vector`s
* Symbolic clustering, context-aware snapshots
* GUI dashboard, real-time reinforcement streams, and more

We welcome contributors! See the `TODO.md` for high-level tasks and issue ideas.

---

## 📧 Contact & License

**Author**: Felipe Muniz – 2025
**License**: Custom symbolic (non-commercial research).
Feel free to contribute or reach out via GitHub or email if you're interested in collaboration.

---

## 🚀 In Summary

EidosDB is **not just a database**—it’s a **memory engine for symbolic intelligence**. It models ideas as entities that *live, fade, and grow* within their context—opening new possibilities in cognitive AI and knowledge modeling.

Try it, experiment, and join the symbolic memory movement!
