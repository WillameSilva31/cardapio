# ==============================
# Build do Frontend (Vite)
# ==============================
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend

COPY ./cardapioF/package*.json ./
RUN npm ci && npm cache clean --force

COPY ./cardapioF .
RUN npm run build

# ==============================
# Build do Backend (CACHE INTELIGENTE)
# ==============================
FROM eclipse-temurin:21-jdk-jammy AS backend-build
WORKDIR /app/backend

# 1. Copiar apenas arquivos de configuração (para cache)
COPY ./cardapioB/pom.xml ./
COPY ./cardapioB/.mvn ./.mvn
COPY ./cardapioB/mvnw ./

# 2. Download de dependências (fica em cache se pom.xml não mudar)
RUN chmod +x ./mvnw && ./mvnw dependency:go-offline -B

# 3. Copiar apenas código fonte (SEM sobrescrever mvnw!)
COPY ./cardapioB/src/ ./src/

# 4. Copiar outros arquivos necessários (se existirem)
COPY ./cardapioB/src/main/resources/ ./src/main/resources/

# 5. Copiar frontend build
COPY --from=frontend-build /app/frontend/dist ./src/main/resources/static/

# 6. Build (mvnw mantém permissões)
RUN ./mvnw clean package -DskipTests -B -q

# ==============================
# Runtime
# ==============================
FROM eclipse-temurin:21-jre-jammy
RUN groupadd -r appgroup && useradd -r -g appgroup appuser
WORKDIR /app
COPY --from=backend-build /app/backend/target/*.jar app.jar
RUN chown appuser:appgroup app.jar
USER appuser

ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+UseG1GC"
EXPOSE $PORT
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]