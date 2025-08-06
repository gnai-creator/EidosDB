# TODO — EidosDB Development Roadmap

> Author: Felipe Muniz
> Project: EidosDB
> Status: Draft

---

## ✅ DONE

* [x] Symbolic idea schema (SemanticIdea)
* [x] Velocity formula (`v = 4wr / (π√(1 - (wr/c)^2))`)
* [x] API core: insert, query, decay, reinforce, dump
* [x] In-memory storage engine
* [x] JSON persistence
* [x] TypeScript structure
* [x] Whitepaper (EN/PT)
* [x] Pitch deck outline
* [x] GitHub repo & basic docs
* [x] License
* [x] ResearchGate submission (in progress)

---

## 🚧 CORE DEVELOPMENT

* [x] Add ANN (Approximate Nearest Neighbor) for high-speed vector search
* [x] Implement vector similarity fallback (cosine or dot-product)
* [x] Enable symbolic clustering / selectors (filters by context, metadata, tags)
* [x] Enable symbolic snapshots (dump + restore states)
* [x] Implement TTL (time-to-live) or symbolic expiration
* [x] Export to Redis or SQLite as pluggable storage option
* [x] Stream-based reinforcement (via websocket or Kafka)
* [x] Optimize decay loop for GPU (optional)

---

## ⚙️ ENGINEERING

* [x] Full unit test suite (Jest)
* [x] API rate limiting
* [x] Logging system with symbolic metrics (e.g. average `v`, dominant cluster)
* [x] Real-time monitoring dashboard
* [x] Setup Dockerfile + deployment script
* [x] Optional REST-to-GraphQL adapter

---

## 🔐 SECURITY & LICENSE

* [x] CC BY-NC 4.0 license
* [x] License validator at runtime
* [x] API key system (with tier control)
* [x] Usage tracking + abuse prevention

---

## 💡 PRODUCT FEATURES

* [x] Interactive dashboard (embed browser + memory heatmap)
* [ ] Semantic visualizer: PCA/tSNE of vectors by cluster/context
* [ ] CLI client for local insert/query/decay
* [ ] Desktop mini-tool for memory inspection
* [ ] GUI assistant to simulate AGI memory (timeline interface)

---

## 📈 GROWTH / DISTRIBUTION

* [ ] Public landing page (eidosdb.com on eidosdb.dev)
* [ ] App Store/Marketplace listings (e.g. G2, ProductHunt, GitHub Marketplace)
* [ ] Community: Discord / GitHub Discussions
* [ ] Publish tutorial video (how it works)
* [ ] Write comparison post: EidosDB vs VectorDB vs LLM-memory

---

## 🔬 RESEARCH TRACK

* [ ] Submit paper to arXiv (CS.AI / Symbolic Reasoning)
* [ ] Compare with neural-symbolic hybrid architectures
* [ ] Publish benchmark results: speed, memory decay, symbolic relevance over time

---

## 🧠 FUTURE IDEAS

### Symbolic Intelligence & Memory

* [ ] Multi-agent memory interaction (EidosDB → EidosNet)
* [ ] Symbolic contradiction detection
* [ ] Conceptual mutation engine (evolution of ideas)
* [ ] Adaptive memory compression (cluster pruning)

### Reflective Reasoning

* [ ] Meta-consistency evaluator: "minha ontologia se contradiz?"
* [ ] Auto-curation and memory cleaning (low-v concepts decay faster)
* [ ] Reflexive queries: "o que mudou na minha visão?"
* [ ] Symbolic loopback: outputs voltam como entradas simbólicas

### Integration

* [ ] EidosDB + LLM feedback loop
* [ ] Embedding sync from external models
* [ ] Vector-symbology auto-alignment

---

> Last updated: 2025-08-05
> Suggested format: maintain TODO.md inside the root of repo and sync it with each milestone
