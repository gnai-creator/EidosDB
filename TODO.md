# TODO — EidosDB Backend Roadmap

> Projeto: EidosDB (engine simbólica)
> Repositório: `eidosdb`
> Autor: Felipe Muniz

---

## ✅ CONCLUÍDO

* [x] API core: insert, query, decay, reinforce, dump
* [x] ANN (Approximate Nearest Neighbor)
* [x] Similaridade vetorial com fallback (cosine / dot)
* [x] Clustering simbólico (por tags e contexto)
* [x] Snapshots simbólicos (dump / restore)
* [x] TTL por ideia (decadência com tempo)
* [x] Exportação para Redis e SQLite
* [x] Reforço via WebSocket / stream
* [x] Loop de decay com suporte a GPU (opcional)
* [x] Licença CC BY-NC 4.0 + validador
* [x] Sistema de chaves de API com tiers
* [x] Adapter opcional REST → GraphQL

---

## ⚙️ ENGENHARIA E INFRA

* [ ] Refatorar decodificador de entrada (normalizar vetores e símbolos)
* [ ] Adicionar testes e benchmarks com carga sintética
* [ ] Criar /benchmark endpoint para medir latência
* [ ] Testes com LLM para comparação de resgate simbólico

---

## 🔬 PESQUISA

* [ ] Publicar artigo no arXiv (CS.AI / Symbolic Reasoning)
* [ ] Benchmark com vector DBs padrão (Pinecone, Weaviate, Redis)
* [ ] Analisar relevância simbólica ao longo do tempo
* [ ] Comparar com arquiteturas neuro-simbólicas (MEMNET, DNC, RETAIN)

---

## 🧠 EVOLUÇÃO SIMBÓLICA

### Inteligência e Memória

* [ ] Interação multi-agente via EidosNet
* [ ] Detecção de contradição simbólica
* [ ] Motor de mutação conceitual (evolução de ideias)
* [ ] Compressão adaptativa de memória (cluster pruning)

### Raciocínio Reflexivo

* [ ] Avaliador de meta-consistência (“minha ontologia se contradiz?”)
* [ ] Curadoria automática e decay seletivo
* [ ] Queries reflexivas (“o que mudou na minha visão?”)
* [ ] Loop simbólico: outputs que viram inputs

### Integrações externas

* [ ] Loop com LLMs externos (feedback contextual)
* [ ] Sincronização de embeddings externos (OpenAI, HuggingFace)
* [ ] Alinhamento simbólico-vetorial automático

---

## 📦 FERRAMENTAS DEV

* [ ] CLI client (`eidos query "..."`)
* [ ] Mini desktop viewer (inspecionar estado simbólico)
* [ ] Exportador `.eidostate` (com estado e contexto)

---

> Última atualização: 2025-08-05
