# Vaishnavi BookStore

A responsive online book store built with:

- React + Vite
- Spring Boot 4.1.1
- Java 26
- Maven
- MySQL 8
- Spring Web
- Spring Data JPA
- Lombok (included in pom, though the source intentionally avoids requiring Lombok)
- Docker / Docker Compose

## Pages

- Home — branded as **Vaishnavi**
- Login
- Registration
- Catalogue
- Responsive navigation
- Search/filter/sort
- Add-to-cart UI
- Animated modern interface

## Run locally

### Backend

1. Start MySQL.
2. Create a database named `vaishnavi_bookstore`, or let Docker Compose create it.
3. Open `backend`.
4. Run:

```bash
mvnw spring-boot:run
```

On Windows, use:

```bash
mvnw.cmd spring-boot:run
```

Backend runs at `http://localhost:8080`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Run everything with Docker

From the project root:

```bash
docker compose up --build
```

Open:

```text
http://localhost:3000
```

MySQL is exposed on port 3307 on the host to avoid common local MySQL port conflicts.

## Demo account

Register a new account from the Registration page. Passwords are stored as SHA-256 hashes for this academic/demo project.

For a production application, replace this with Spring Security + BCrypt/Argon2 + JWT/session authentication.
