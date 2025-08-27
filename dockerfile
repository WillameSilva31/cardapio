# Frontend
FROM node:18-alpine AS frontend
WORKDIR /app
COPY ./cardapioF/package*.json ./
RUN npm ci && npm cache clean --force
COPY ./cardapioF/ ./
RUN npm run build

# Backend
FROM eclipse-temurin:21-jdk-jammy AS backend
WORKDIR /app

# Cache de dependências
COPY ./cardapioB/pom.xml ./cardapioB/.mvn/ ./cardapioB/mvnw ./
RUN chmod +x ./mvnw && ./mvnw dependency:go-offline -B

# Código fonte apenas
COPY ./cardapioB/src/ ./src/
COPY --from=frontend /app/dist/ ./src/main/resources/static/

# Build
RUN ./mvnw clean package -DskipTests -B -q

# Runtime
FROM eclipse-temurin:21-jre-jammy
RUN groupadd -r app && useradd -r -g app app
WORKDIR /app
COPY --from=backend /app/target/*.jar app.jar
RUN chown app:app app.jar
USER app
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"
EXPOSE $PORT
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]