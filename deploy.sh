#!/bin/bash
# Script de deploy do EidosDB usando Docker

# Encerrar imediatamente se algum comando falhar
set -e

IMAGEM="eidosdb"
CONTAINER="eidosdb_container"

# Remover contêiner existente, se houver
if [ "$(docker ps -aq -f name=$CONTAINER)" ]; then
  docker rm -f $CONTAINER
fi

# Construir a imagem Docker
docker build -t $IMAGEM .

# Iniciar o contêiner em segundo plano
docker run -d --name $CONTAINER -p 3000:3000 $IMAGEM
