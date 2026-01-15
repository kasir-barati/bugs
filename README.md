# NestJS Batch Processing with RabbitMQ

A Dockerized NestJS application that demonstrates batch processing with RabbitMQ using topic exchange and durable queues.

## Getting Started

1. ```bash
   docker compose up --build -d
   ```
2. **Access the application:**
   - **Swagger UI**: http://localhost:3000/api.
   - **RabbitMQ Management UI**: http://localhost:15672 (username: `guest`, password: `guest`).

## Testing the Application

1. [Run the app](#getting-started).
2. ```cmd
   python3 send_req.py
   ```
