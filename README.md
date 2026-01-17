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

### Update

I just realized that when we set `prefetchCount` to a number higher than one, it is similar to specifying the size in `batchOptions` where it has some quirks and traits (**read the comments written in each handler method!**):

<table>
<thead><tr><th>Instead of</th><th>We can do this</th></tr></thead>
<tbody><tr><td>

```ts
@Module({
  imports: [
    RabbitMQModule.forRoot({
      // ...
      prefetchCount: 10,
    }),
  ],
  providers: [RabbitmqConsumer],
  // ...
})
export class RabbitmqModule {}
// ...
@Injectable()
export class RabbitmqConsumer {
  @RabbitSubscribe({
    // ...
    batchOptions: {
      size: 10,
    },
  })
  async handleMessages(messages: MessageDto[]) {
    // This handler will be called once instead of 10 times.
    // This is what batching means, so e.g. if we increase the prefetchCount to 20, it will call this handler twice with each batch containing 10 message!
    // Can be useful when we know we can capitalize on that (e.g. instead of making 10 identical individual I/O we might be able to make a single one).
  }
}
```

</td><td>

```ts
@Module({
  imports: [
    RabbitMQModule.forRoot({
      // ...
      prefetchCount: 10,
    }),
  ],
  providers: [RabbitmqConsumer],
  // ...
})
export class RabbitmqModule {}
// ...
@Injectable()
export class RabbitmqConsumer {
  @RabbitSubscribe({
    // ...
  })
  async handleMessage(messages: MessageDto) {
    // This will be called 10 times if we have 10 message in the queue
    // And even if we async await syntax each message won't block the event loop.
    // In other words the handler will be called as in we are parallelizing processing messages!
  }
}
```

</td></tr></tbody></table>

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
