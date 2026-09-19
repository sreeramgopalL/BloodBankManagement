# Multi-stage Dockerfile for Render / Cloud deployment
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /build

COPY pom.xml .
COPY auth-service auth-service

RUN mvn -pl auth-service clean package -DskipTests

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=builder /build/auth-service/target/*.jar app.jar
EXPOSE 8086
ENTRYPOINT ["java", "-jar", "app.jar"]
