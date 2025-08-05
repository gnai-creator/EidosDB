# TODO — EidosDB Development Roadmap

> Author: Felipe Muniz  
> Project: EidosDB  
> Status: Draft

---

## ✅ DONE
- [x] Symbolic idea schema (SemanticIdea)
- [x] Velocity formula (`v = 4wr / (π√(1 - (wr/c)^2))`)
- [x] API core: insert, query, decay, reinforce, dump
- [x] In-memory storage engine
- [x] JSON persistence
- [x] TypeScript structure
- [x] Whitepaper (EN/PT)
- [x] Pitch deck outline
- [x] GitHub repo & basic docs
- [x] License
- [x] ResearchGate submission (in progress)

---

## 🚧 CORE DEVELOPMENT
 - [x] Add ANN (Approximate Nearest Neighbor) for high-speed vector search
- [x] Implement vector similarity fallback (cosine or dot-product)
- [ ] Enable symbolic clustering / selectors (filters by context, metadata, tags)
- [ ] Enable symbolic snapshots (dump + restore states)
- [ ] Implement TTL (time-to-live) or symbolic expiration
- [ ] Export to Redis or SQLite as pluggable storage option
- [ ] Stream-based reinforcement (via websocket or Kafka)
- [ ] Optimize decay loop for GPU (optional)

---

## ⚙️ ENGINEERING
- [ ] Full unit test suite (Jest)
- [ ] API rate limiting
- [ ] Logging system with symbolic metrics (e.g. average `v`, dominant cluster)
- [ ] Real-time monitoring dashboard
- [ ] Setup Dockerfile + deployment script
- [ ] Optional REST-to-GraphQL adapter

---

## 🔐 SECURITY & LICENSE
- [ ] Symbolic license final draft (non-commercial / research clause)
- [ ] License validator at runtime
- [ ] API key system (with tier control)
- [ ] Usage tracking + abuse prevention

---

## 💡 PRODUCT FEATURES
- [ ] Interactive dashboard (embed browser + memory heatmap)
- [ ] Semantic visualizer: PCA/tSNE of vectors by cluster/context
- [ ] CLI client for local insert/query/decay
- [ ] Desktop mini-tool for memory inspection
- [ ] GUI assistant to simulate AGI memory (timeline interface)

---

## 📈 GROWTH / DISTRIBUTION
- [ ] Public landing page (eidosdb.io or under bittery.org)
- [ ] App Store/Marketplace listings (e.g. G2, ProductHunt, GitHub Marketplace)
- [ ] Community: Discord / GitHub Discussions
- [ ] Publish tutorial video (how it works)
- [ ] Write comparison post: EidosDB vs VectorDB vs LLM-memory

---

## 🔬 RESEARCH TRACK
- [ ] Submit paper to arXiv (CS.AI / Symbolic Reasoning)
- [ ] Compare with neural-symbolic hybrid architectures
- [ ] Publish benchmark results: speed, memory decay, symbolic relevance over time

---

## 🧠 FUTURE IDEAS
- [ ] Multi-agent memory interaction (EidosDB → EidosNet)
- [ ] Symbolic contradiction detection
- [ ] Conceptual mutation engine (evolution of ideas)
- [ ] Adaptive memory compression (cluster pruning)

---

> Last updated: 2025-08-05  
> Suggested format: maintain TODO.md inside the root of repo and sync it with each milestone

