# Build stage
FROM maven:3.8.8-eclipse-temurin-17 AS builder
WORKDIR /workspace

# copy maven files and source
COPY pom.xml ./
COPY src ./src

# package application (skip tests for faster build in CI)
RUN mvn -B -DskipTests package

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built jar from the builder stage
# Adjust the jar name pattern if necessary
COPY --from=builder /workspace/target/*.jar ./app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
