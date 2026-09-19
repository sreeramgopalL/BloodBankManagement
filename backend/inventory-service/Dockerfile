# Multi-stage Dockerfile for Render / Cloud deployment
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /build

COPY . .

RUN mvn -pl inventory-service clean package -DskipTests

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=builder /build/inventory-service/target/*.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-Xmx384m", "-jar", "app.jar"]
