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
  * and contextual metadata (e.g., emotion, origin, type).

* **Physics-Inspired Presence Formula**

  ```ts
  v = (4 * w * r) / (π * √(1 − (w * r / c)²))
  ```

  This formula creates a “velocity-like” symbolic presence score (`v`) inspired by relativity.

* **Memory Behavior**

  * **Decay over time** (`tick()` lowers `w`)
  * **Reinforcement** (`reinforce(id)`) to boost an idea
  * **Context-based filtering** and search

* **REST API Interface**
  Easily insert, query, decay, or reinforce memory via HTTP endpoints like `/insert`, `/query`, `/tick`, `/reinforce`.

* **Approximate Nearest Neighbor (ANN) index**
  Busca vetores semelhantes de forma acelerada usando hashing sensível à localidade.

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
* `GET /query?w=0.003` → Rank by symbolic presence
* `POST /tick` → Apply decay cycle
* `POST /reinforce` → Reinforce an idea
* `GET /dump` → Dump raw memory

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
  metadata: { emotion: "wonder", origin: "thought experiment" }
};
await api.post('/insert', idea);
```

To query memory presence:

```bash
GET /query?w=0.003
```

Returns a list of ideas sorted by `v` — the higher the `v`, the more present the idea is right now.

---

## 🧭 Roadmap & Contributions

We have a roadmap for enhancing EidosDB including:

* Integration with real semantic models for generating `vector`s
* Symbolic clustering, TTL/expiration, context-aware snapshots
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
