# Imagem base com Node.js
FROM node:20-alpine

# Definir diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar arquivos de dependências para otimizar o cache de build
COPY eidosdb/package*.json ./

# Pacotes necessários para build do canvas
RUN apk add --no-cache \
    g++ \
    make \
    python3 \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev

# Instalar dependências sem pacotes de desenvolvimento
RUN npm ci --omit=dev

# Copiar o restante do código da aplicação
COPY eidosdb/ .

# Expor a porta utilizada pela API
EXPOSE 3000

# Comando padrão para iniciar o servidor
CMD ["npm", "run", "start:api"]
