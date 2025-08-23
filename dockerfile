# Dockerfile para fazer o Render detectar como projeto Docker
# Este arquivo é apenas um "ponteiro" para o docker-compose.yml

FROM alpine:latest

# Instala o Docker Compose
RUN apk add --no-cache docker-cli docker-compose

# Copia todo o projeto
COPY . .

# Comando que inicia o Docker Compose
CMD ["docker-compose", "up", "--build"]