# NestJS Batch Processing with RabbitMQ

A dockerized NestJS application that demonstrates batch processing with RabbitMQ using topic exchange and durable queues.

## Features

- ✅ RESTful API with Swagger UI
- ✅ RabbitMQ integration using `@golevelup/nestjs-rabbitmq`
- ✅ Topic exchange with durable queue
- ✅ Message publishing endpoint
- ✅ Queue message count monitoring
- ✅ Consumer with structured logging
- ✅ Docker Compose orchestration
- ✅ No authentication required

## Architecture

- **NestJS Application**: REST API and message consumer
- **RabbitMQ**: Message broker with management UI
- **Docker Compose**: Container orchestration

## Message Format

Messages follow this JSON structure:

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

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Running the Application

1. **Start the services:**

```bash
docker-compose up --build
```

2. **Access the application:**

- **Swagger UI**: http://localhost:3000/api
- **RabbitMQ Management UI**: http://localhost:15672 (username: `guest`, password: `guest`)

### API Endpoints

#### 1. Publish Message

**POST** `/api/publish`

Publishes a message to the RabbitMQ queue.

**Request Body:**
```json
{
  "event": "user.created",
  "value": {
    "userId": 123,
    "name": "John Doe"
  },
  "timestamp": "2026-01-15T11:30:27.327Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message published successfully"
}
```

#### 2. Get Queue Message Count

**GET** `/api/queue/count`

Returns the current number of messages in the queue.

**Response:**
```json
{
  "queue": "batch-processing-queue",
  "messageCount": 5
}
```

## Testing the Application

1. Open Swagger UI at http://localhost:3000/api
2. Use the **POST /api/publish** endpoint to send a message
3. Check the Docker logs to see the consumer processing the message:
   ```bash
   docker-compose logs -f nestjs-app
   ```
4. Use the **GET /api/queue/count** endpoint to check queue status

## Configuration

Environment variables are configured in `docker-compose.yml`:

- `RABBITMQ_URL`: RabbitMQ connection URL
- `RABBITMQ_EXCHANGE`: Exchange name (default: `batch-exchange`)
- `RABBITMQ_QUEUE`: Queue name (default: `batch-processing-queue`)
- `RABBITMQ_ROUTING_KEY`: Routing key (default: `batch.process`)
- `RABBITMQ_MANAGEMENT_URL`: RabbitMQ management API URL

## RabbitMQ Configuration

- **Exchange Type**: Topic
- **Queue**: Durable (survives RabbitMQ restarts)
- **Routing Key**: `batch.process`
- **Processing**: One-by-one (ready for batch processing extension)

## Development

### Local Development (without Docker)

1. Install dependencies:
```bash
npm install
```

2. Start RabbitMQ locally or update the connection URL

3. Run the application:
```bash
npm run start:dev
```

### Stopping the Application

```bash
docker-compose down
```

To remove volumes as well:
```bash
docker-compose down -v
```

## Future Enhancements

The architecture is ready for batch processing implementation:
- Collect messages over a time window
- Process multiple messages together
- Implement batch acknowledgment
- Add batch size and timeout configurations

## Project Structure

```
test-batch/
├── docker-compose.yml          # Docker orchestration
├── Dockerfile                  # NestJS app container
├── package.json                # Dependencies
├── tsconfig.json              # TypeScript configuration
├── nest-cli.json              # NestJS CLI configuration
└── src/
    ├── main.ts                # Application entry point
    ├── app.module.ts          # Root module
    ├── app.controller.ts      # REST API endpoints
    ├── app.service.ts         # Business logic
    ├── dto/
    │   └── message.dto.ts     # Message validation
    └── rabbitmq/
        ├── rabbitmq.module.ts    # RabbitMQ configuration
        ├── rabbitmq.service.ts   # Publisher & queue management
        └── rabbitmq.consumer.ts  # Message consumer
```

## License

MIT
