# ==============================
# Build do Frontend (Vite) - Corrigido
# ==============================
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend

# Cache de dependências (PRECISA das devDependencies para build)
COPY ./cardapioF/package*.json ./
RUN npm ci && npm cache clean --force

# Build do frontend
COPY ./cardapioF .
RUN npm run build

# ==============================
# Build do Backend (Spring Boot) - Otimizado
# ==============================
FROM eclipse-temurin:21-jdk-jammy AS backend-build
WORKDIR /app/backend

# Cache de dependências Maven
COPY ./cardapioB/pom.xml ./
COPY ./cardapioB/mvnw ./
COPY ./cardapioB/.mvn ./.mvn

# Fix de permissão + download offline
RUN chmod +x ./mvnw && ./mvnw dependency:go-offline -B

# Copiar código fonte
COPY ./cardapioB .

# Copiar build do frontend
COPY --from=frontend-build /app/frontend/dist ./src/main/resources/static/

# Build mais silencioso e rápido
RUN ./mvnw clean package -DskipTests -B -q

# ==============================
# Imagem final (Runtime Ultra-Leve)
# ==============================
FROM eclipse-temurin:21-jre-jammy

# Usuário não-root para segurança
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

WORKDIR /app

# Copiar JAR
COPY --from=backend-build /app/backend/target/*.jar app.jar
RUN chown appuser:appgroup app.jar

# Mudar para usuário não-root
USER appuser

# JVM otimizada para containers pequenos (Render)
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+UseG1GC -XX:+UnlockExperimentalVMOptions"

EXPOSE $PORT

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]