# NestJS Batch Processing with RabbitMQ

A Dockerized NestJS application that demonstrates batch processing with RabbitMQ using topic exchange and durable queues.

> [!NOTE]
>
> For testing I mocked throwing an exception in way that I have full control over when it raises an exception. So you can get rid of codes that have this comment on top of them:
>
> ```ts
> // README: Just for testing!
> ```

## My Issue

[This](https://github.com/kasir-barati/bugs/blob/3b672b3335ff9f429546810ca126dc2d6108deb0/src/modules/rabbitmq/rabbitmq.consumer.ts#L29) will nack the batch wholesome, it does not care if we were able to process some of the messages!

> ✅ **Solution**
>
> Instead of throwing an exception inside the consumer I wrapped the whole thing in a `try...catch` block and requeued them in the `catch` block!

## Getting Started

1. ```bash
   docker compose up --build -d
   ```
2. Access the application:
   - **Swagger UI**: http://localhost:3000/api.
   - **RabbitMQ Management UI**: http://localhost:15672 (username: `guest`, password: `guest`).

## Testing the Application

1. [Run the app](#getting-started).
2. ```cmd
   python3 send_req.py
   ```
