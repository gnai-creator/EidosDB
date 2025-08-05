# 🧬 EidosDB

EidosDB is an experimental symbolic database implemented in TypeScript. It evaluates the relevance of stored concepts using a relativistic-inspired access formula.

## ✨ Features

- Relativistic access function `calculateV` for ranking data by frequency and distance
- In-memory `EidosStore` with optional persistence to disk
- REST API for inserting, querying and evolving memory
- Written in TypeScript with **ts-node** for rapid prototyping

## 🚀 Getting Started

### Requirements

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/gnai-creator/EidosDB.git
cd EidosDB/eidosdb
npm install
```

### Running the API

```bash
npm run start:api
# API available at http://localhost:3000
```

### Using the Core Formula

```ts
import { calculateV } from "./src/core/formula";

const v = calculateV(0.04, 3500);
// v is the effective access velocity
```

## 📁 Project Structure

```
eidosdb/
├── src/
│   ├── api/        # Express server exposing the REST interface
│   ├── core/       # Relativistic formula and symbolic types
│   ├── storage/    # In-memory store and persistence helpers
│   ├── semantic/   # Experimental semantic helpers
│   └── utils/      # General utilities
└── data/          # Example dataset
```

## 🛣️ Roadmap

- [x] Define core relativistic access function
- [ ] Persist symbolic data and rank entries by `v`
- [ ] Implement decay and reinforcement mechanisms
- [ ] Expose CLI and web dashboard
- [ ] Create comprehensive test suite

## ⚠️ Disclaimer

EidosDB is a research and artistic prototype. It is **not** ready for production use.

## 🧠 Author

Felipe Muniz • [gnai-creator](https://github.com/gnai-creator)

