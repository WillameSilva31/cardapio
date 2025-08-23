# Dockerfile único combinando seus Dockerfiles existentes

# Build do Frontend (baseado no seu Dockerfile do frontend)
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY ./cardapioF/package*.json ./
RUN npm ci
COPY ./cardapioF .
RUN npm run build

# Build do Backend (baseado no seu Dockerfile do backend)
FROM eclipse-temurin:21-jdk-jammy AS backend-build
WORKDIR /app/backend
COPY ./cardapioB .

# Copiar arquivos do frontend (Vite) para o Spring Boot servir
COPY --from=frontend-build /app/frontend/dist ./src/main/resources/static/
# Debug: Verificar estrutura dos arquivos Vite
RUN echo "Listando arquivos do Vite:" && ls -la ./src/main/resources/static/ && echo "Conteúdo detalhado:" && find ./src/main/resources/static/ -type f

RUN chmod +x ./mvnw
RUN ./mvnw clean install -DskipTests

# Imagem final - apenas runtime
FROM eclipse-temurin:21-jdk-jammy

# Copiar JAR final
COPY --from=backend-build /app/backend/target/cardapio-0.0.1-SNAPSHOT.jar /app/app.jar

# Porta que será exposta
EXPOSE 80

# Variáveis de ambiente
ENV JAVA_OPTS="-Xmx512m -Xms256m"
ENV PORT=80

# Executar Spring Boot (que agora serve frontend + backend)
ENTRYPOINT ["java", "-jar", "/app/app.jar"]