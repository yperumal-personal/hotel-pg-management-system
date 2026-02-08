# PG Management System — Backend

This is the backend API for the PG Management System, built with Spring Boot and Maven.

**Overview**
- **Stack:** Java (Spring Boot), Maven, PostgreSQL, Redis (optional)
- **API base path:** /api (default)

**Prerequisites**
- **Java:** JDK 17 (project property `java.version` = 17). Check with:

  ```bash
  java -version
  ```

- **Maven:** 3.x (use `mvn -v`). Install via Homebrew on macOS:

  ```bash
  brew install maven
  ```

- **PostgreSQL:** A running PostgreSQL instance with a database for the app. Default settings are in [src/main/resources/application.properties](src/main/resources/application.properties).

- **Redis (optional):** Required only if you want Redis-backed features (caching, session store). Start via Homebrew:

  ```bash
  brew install redis
  brew services start redis
  ```

**Configuration**
- Edit `src/main/resources/application.properties` or override properties with environment variables. Default DB settings (example) in the repository:

- Database URL: `spring.datasource.url=jdbc:postgresql://localhost:5432/pg_management`
- Username/password: `spring.datasource.username` / `spring.datasource.password`

- Alternatively, set environment variables before running:

  ```bash
  export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/pg_management
  export SPRING_DATASOURCE_USERNAME=postgres
  export SPRING_DATASOURCE_PASSWORD=password
  ```

**Database schema**
- The project root contains `database/schema.sql` to create the initial schema and tables. Apply it to your database:

  ```bash
  psql -U <db_user> -d pg_management -f database/schema.sql
  ```

**Build & Run**
- From the repository root:

  ```bash
  cd backend
  mvn clean package          # build the jar
  mvn spring-boot:run       # run directly with Maven
  # or
  java -jar target/pg-management-backend-1.0.0.jar
  ```

- The server listens on `http://localhost:8080/api` by default (see `server.port` and `server.servlet.context-path`).

**Tests**
- Run unit/integration tests:

  ```bash
  mvn test
  ```

**Useful commands**
- Check Maven: `mvn -v`
- Check Java: `java -version`
- Start Redis: `brew services start redis`

**Troubleshooting**
- If the app cannot connect to the DB, confirm the DB is running and credentials match `application.properties` or environment variables.
- If you see a Java version error, ensure `JAVA_HOME` points to a JDK 17 installation.
- For permission or port issues, inspect logs in the console (Spring Boot logging is enabled at DEBUG for `com.pgmanagement`).

**Files of interest**
- Application properties: [src/main/resources/application.properties](src/main/resources/application.properties)
- DB schema: [../database/schema.sql](../database/schema.sql)
- Main application: [src/main/java/com/pgmanagement/PgManagementApplication.java](src/main/java/com/pgmanagement/PgManagementApplication.java)

---
If you want, I can: run a Maven build now, update `application.properties` to use environment variables, or add a sample `.env`/startup script. Which would you like next?
