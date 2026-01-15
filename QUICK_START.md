# Quick Start Guide

## Start the Application

```bash
docker compose up --build -d
```

## Access the Application

- **Swagger UI**: http://localhost:3000/api
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)

## Test the Application

### 1. Publish a Message

Open Swagger UI and use the **POST /api/publish** endpoint:

```json
{
  "event": "user.created",
  "value": {
    "userId": 123,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "timestamp": "2026-01-15T11:30:27.327Z"
}
```

### 2. Check Consumer Logs

```bash
docker compose logs -f nestjs-app
```

You should see the consumer logging the received message:

```
[RabbitMQConsumer] === Received Message ===
{
  "event": "user.created",
  "value": { ... },
  "timestamp": "..."
}
[RabbitMQConsumer] ========================
```

### 3. Check Queue Message Count

Use the **GET /api/queue/count** endpoint in Swagger UI.

Response:

```json
{
  "queue": "batch-processing-queue",
  "messageCount": 0
}
```

## Stop the Application

```bash
docker compose down
```

## Remove All Data

```bash
docker compose down -v
```

## Architecture

- **Exchange**: `batch-exchange` (Topic)
- **Queue**: `batch-processing-queue` (Durable)
- **Routing Key**: `batch.process`
- **Processing**: One-by-one (ready for batch processing)

## Next Steps

To implement actual batch processing:

1. Modify the consumer to collect messages over a time window
2. Process multiple messages together
3. Implement batch acknowledgment
4. Add batch size and timeout configurations
