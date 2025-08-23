# Dockerfile sem nginx - Spring Boot serve tudo
FROM node:18-alpine as frontend-build

# Build do Frontend (React)
WORKDIR /app/frontend
COPY ./cardapioF/package*.json ./
RUN npm install
COPY ./cardapioF .
ENV VITE_API_URL=/api
RUN npm run build

# Build do Backend (Spring Boot)
FROM openjdk:17-jdk-alpine as backend-build
WORKDIR /app/backend

# Copiar arquivos do Maven
COPY ./cardapioB/pom.xml ./
COPY ./cardapioB/mvnw ./
COPY ./cardapioB/.mvn ./.mvn

# Baixar dependências
RUN ./mvnw dependency:resolve

# Copiar código fonte
COPY ./cardapioB/src ./src

# Copiar arquivos do React para src/main/resources/static
COPY --from=frontend-build /app/frontend/build ./src/main/resources/static/
COPY --from=frontend-build /app/frontend/dist ./src/main/resources/static/

# Buildar o JAR com frontend incluído
RUN ./mvnw clean package -DskipTests

# Imagem final - apenas OpenJDK
FROM openjdk:17-jdk-alpine

# Copiar JAR final
COPY --from=backend-build /app/backend/target/*.jar /app/app.jar

# Porta que será exposta
EXPOSE 80

# Variáveis de ambiente
ENV JAVA_OPTS="-Xmx512m -Xms256m"
ENV SERVER_PORT=80

# Executar apenas o Spring Boot
CMD java $JAVA_OPTS -jar /app/app.jar