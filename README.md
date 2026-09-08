# Vaishnavi BookStore

Vaishnavi BookStore is a full-stack online bookstore application. Users can browse books, search and filter the catalogue, create an account, manage a database-backed shopping cart, place an order without an online payment gateway, and view the generated invoice.

## Aim

To design and develop a responsive online bookstore that provides a simple and reliable platform for browsing books, managing user accounts, storing cart and order information, and generating invoices.

## Objectives

- Build a responsive and user-friendly bookstore interface.
- Allow users to register and log in for the application workflow.
- Display books with title, author, category, price, rating, description, and stock details.
- Provide search, category filtering, and price/rating sorting.
- Restrict cart operations to authenticated users.
- Store users, books, cart items, orders, and invoice items in MySQL.
- Validate stock availability when adding items and placing an order.
- Generate an invoice after checkout without implementing a payment gateway.
- Provide a containerized development and deployment setup using Docker Compose.

## Features

- Home page with featured books
- User registration and login
- Book catalogue with search, filtering, and sorting
- Login-first validation when adding books to the cart
- Persistent, user-specific shopping cart
- Cart quantity updates and item removal
- Stock validation and stock reduction after checkout
- Invoice generation and invoice page
- MySQL database persistence through Spring Data JPA
- Responsive design for desktop and mobile screens
- Docker Compose setup for frontend, backend, and MySQL

## Technology Stack

### Frontend

- React `19.1.1`
- React DOM `19.1.1`
- React Router DOM `7.8.2`
- Vite `7.1.3` (configured version)
- Framer Motion `12.23.12`
- Lucide React `0.468.0`

### Backend

- Java `26`
- Spring Boot `4.1.1`
- Spring Web
- Spring Data JPA
- Maven
- MySQL Connector/J

### Database and Deployment

- MySQL `8.4` Docker image
- Docker Compose
- Nginx for serving the production frontend and proxying `/api` requests

## Software Requirements

### Required Software

- Windows, macOS, or Linux
- Docker Desktop with Docker Compose support
- Git

### Optional Software for Local Development

- Java Development Kit `26`
- Maven `3.9+`, or the Maven Wrapper included in `backend/mvnw`
- Node.js and npm compatible with the installed Vite version
- MySQL `8.x` if the database is run outside Docker
- MySQL Workbench or another MySQL client for viewing database records

Docker Desktop is the easiest way to run the complete project because it provides the required MySQL, backend, and frontend services together.

## Project Structure

```text
vaishnavi_bookstore/
├── docker-compose.yml                 # MySQL, backend, and frontend services
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── mvnw                            # Maven Wrapper for Unix-like environments
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/book/store/
│       │   ├── StoreApplication.java
│       │   ├── config/
│       │   │   ├── CorsConfig.java
│       │   │   └── DataInitializer.java
│       │   ├── controller/
│       │   │   ├── AuthController.java
│       │   │   ├── BookController.java
│       │   │   └── OrderController.java
│       │   ├── dto/
│       │   │   ├── AuthResponse.java
│       │   │   ├── CartItemResponse.java
│       │   │   ├── InvoiceResponse.java
│       │   │   ├── LoginRequest.java
│       │   │   └── RegisterRequest.java
│       │   ├── model/
│       │   │   ├── Book.java
│       │   │   ├── CartItem.java
│       │   │   ├── OrderItem.java
│       │   │   ├── PurchaseOrder.java
│       │   │   └── User.java
│       │   ├── repository/
│       │   └── service/
│       │       ├── AuthService.java
│       │       ├── BookService.java
│       │       └── OrderService.java
│       └── resources/application.properties
├── frontend/
│   ├── Dockerfile
│   ├── index.html
│   ├── nginx.conf
│   ├── package.json
│   └── src/
│       ├── api.js                   # Frontend API client
│       ├── App.jsx                  # Routes and page components
│       ├── main.jsx
│       └── styles.css
└── docs/screenshots/                 # Suggested location for project screenshots
```

## Running the Project with Docker

From the project root:

```powershell
cd D:\WT\vaishnavi_bookstore
docker compose up --build -d
docker compose ps
```

Open the application at:

```text
http://localhost:3000
```

Service addresses:

| Service | Address |
|---|---|
| Frontend | `http://localhost:3000` |
| Backend API | `http://localhost:8080` |
| MySQL | `127.0.0.1:3307` |

The MySQL port is a database connection port and should not be opened in a web browser.

To stop the services while keeping database data:

```powershell
docker compose down
```

Do not use `docker compose down -v` unless you intend to delete the MySQL volume and all stored data.

## Running Locally Without Docker

### 1. Start MySQL

Create a database named `vaishnavi_bookstore`, then configure the following environment variables if your local MySQL credentials differ:

```text
DB_URL=jdbc:mysql://localhost:3309/vaishnavi_bookstore
DB_USERNAME=root
DB_PASSWORD=root
```

### 2. Start the Backend

From the `backend` directory:

```powershell
mvn spring-boot:run
```

The backend runs at `http://localhost:8080`.

### 3. Start the Frontend

From the `frontend` directory:

```powershell
npm install
npm run dev
```

The development frontend runs at `http://localhost:5173`.

## Database Information

The backend uses Spring Data JPA and creates or updates tables automatically with `spring.jpa.hibernate.ddl-auto=update`.

Main database tables:

- `users` - registered users
- `books` - catalogue books and stock
- `cart_items` - user-specific cart contents
- `purchase_orders` - generated orders and invoice metadata
- `order_items` - books captured in each order

To open a MySQL shell in the Docker database:

```powershell
docker exec -it vaishnavi-bookstore-mysql mysql -ubookstore -pbookstore vaishnavi_bookstore
```

Useful queries:

```sql
SHOW TABLES;
SELECT * FROM books;
SELECT * FROM users;
SELECT * FROM cart_items;
SELECT * FROM purchase_orders;
SELECT * FROM order_items;
```

The initial catalogue is inserted automatically by `DataInitializer.java` when the `books` table is empty.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/books` | List and filter books |
| `POST` | `/api/auth/register` | Register a user |
| `POST` | `/api/auth/login` | Log in a user |
| `GET` | `/api/cart` | Fetch the logged-in user's cart |
| `POST` | `/api/cart/items/{bookId}` | Add a book to the cart |
| `PUT` | `/api/cart/items/{itemId}` | Update cart quantity |
| `DELETE` | `/api/cart/items/{itemId}` | Remove a cart item |
| `POST` | `/api/orders/checkout` | Create an order and invoice |
| `GET` | `/api/orders/latest` | Fetch the latest invoice |

## Screenshots
### Home Page
<img width="882" height="461" alt="image" src="https://github.com/user-attachments/assets/ebc56981-5317-4d0c-82ae-d5728f489b00" />
<img width="924" height="467" alt="image" src="https://github.com/user-attachments/assets/1172974a-5439-448b-bb74-5581c6eebeb0" />

### Registration & login page
<img width="914" height="470" alt="image" src="https://github.com/user-attachments/assets/027299f3-b4e3-42a6-b704-272973d6e6a6" />
<img width="925" height="461" alt="image" src="https://github.com/user-attachments/assets/4ad489ac-8b73-4d58-b412-171306d83bcd" />

### Catalogue Page
<img width="844" height="466" alt="image" src="https://github.com/user-attachments/assets/3b97b375-abc2-45d3-b484-09220d5e61b3" />
<img width="907" height="465" alt="image" src="https://github.com/user-attachments/assets/c3a00f0f-1747-4ce7-b4ca-3f5834b16a44" />

### Cart
<img width="926" height="467" alt="image" src="https://github.com/user-attachments/assets/dbf56e19-54d8-4a1e-b223-4deed27e78de" />

### MYSQL Workbench
<img width="530" height="218" alt="image" src="https://github.com/user-attachments/assets/f701f36f-0a74-41ca-8a64-c84d0bf92867" />
<img width="481" height="233" alt="image" src="https://github.com/user-attachments/assets/7d86846c-a0cf-44b9-bf71-db1dd3648a05" />
