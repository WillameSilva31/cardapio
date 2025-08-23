# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
# Instala serve globalmente
RUN npm install -g serve
# Copia apenas os arquivos buildados
COPY --from=build /app/dist ./dist
# Expõe a porta 3000 (padrão do Render)
EXPOSE 3000
# Comando para servir os arquivos estáticos
CMD ["serve", "-s", "dist", "-l", "3000"]