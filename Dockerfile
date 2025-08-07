FROM node:20-bullseye-slim

WORKDIR /app

ENV EIDOS_ACCEPT_LICENSE=true
ENV EIDOS_STORAGE=redis

COPY eidosdb/package*.json ./

# Instalar pacotes de sistema necessários, incluindo certificados e wget
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      ca-certificates \
      wget \
      build-essential \
      python3 \
      libcairo2-dev \
      libpango1.0-dev \
      libjpeg-dev \
      libgif-dev && \
    rm -rf /var/lib/apt/lists/*

RUN npm ci --omit=dev

# Baixe o modelo ONNX
RUN mkdir -p /app/models/Xenova/all-MiniLM-L6-v2 && \
    wget -q -P /app/models/Xenova/all-MiniLM-L6-v2 \
      https://huggingface.co/Xenova/all-MiniLM-L6-v2/resolve/main/tokenizer.json && \
    wget -q -P /app/models/Xenova/all-MiniLM-L6-v2 \
      https://huggingface.co/Xenova/all-MiniLM-L6-v2/resolve/main/vocab.txt && \
    # repita para os outros arquivos necessários...
    mkdir -p /app/models/Xenova/all-MiniLM-L6-v2/onnx && \
    wget -q -O /app/models/Xenova/all-MiniLM-L6-v2/onnx/model.onnx \
      https://huggingface.co/Xenova/all-MiniLM-L6-v2/resolve/main/onnx/model.onnx


COPY eidosdb/ .

EXPOSE 3000

CMD ["npm", "run", "start:api"]
