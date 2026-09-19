# Multi-stage Dockerfile for Render / Cloud deployment
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /build

COPY pom.xml .
COPY donor-camp-service donor-camp-service

RUN mvn -pl donor-camp-service clean package -DskipTests

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=builder /build/donor-camp-service/target/*.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]
