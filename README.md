# Bugs

## `TypeError: Channel target must be a string`

```bash
$ pnpm start:dev

[5:23:50 AM] Starting compilation in watch mode...

[5:23:51 AM] Found 0 errors. Watching for file changes.

[Nest] 1586075  - 07/10/2025, 5:23:51 AM     LOG [NestFactory] Starting Nest application...
[Nest] 1586075  - 07/10/2025, 5:23:51 AM   ERROR [ExceptionHandler] TypeError: Channel target must be a string
    at new ChannelImplementation (/home/kasir/projects/bugs/node_modules/.pnpm/@grpc+grpc-js@1.13.4/node_modules/@grpc/grpc-js/src/channel.ts:102:13)
    at new Client (/home/kasir/projects/bugs/node_modules/.pnpm/@grpc+grpc-js@1.13.4/node_modules/@grpc/grpc-js/src/client.ts:158:30)
    at new ServiceClientImpl (/home/kasir/projects/bugs/node_modules/.pnpm/@grpc+grpc-js@1.13.4/node_modules/@grpc/grpc-js/src/make-client.ts:129:3)
    at Injector.instantiateClass (/home/kasir/projects/bugs/node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+mi_9777c7c29fb973cf338f500b14bcdf7a/node_modules/@nestjs/core/injector/injector.js:373:19)
    at callback (/home/kasir/projects/bugs/node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+mi_9777c7c29fb973cf338f500b14bcdf7a/node_modules/@nestjs/core/injector/injector.js:65:45)
    at async Injector.resolveConstructorParams (/home/kasir/projects/bugs/node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+mi_9777c7c29fb973cf338f500b14bcdf7a/node_modules/@nestjs/core/injector/injector.js:145:24)
    at async Injector.loadInstance (/home/kasir/projects/bugs/node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+mi_9777c7c29fb973cf338f500b14bcdf7a/node_modules/@nestjs/core/injector/injector.js:70:13)
    at async Injector.loadProvider (/home/kasir/projects/bugs/node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+mi_9777c7c29fb973cf338f500b14bcdf7a/node_modules/@nestjs/core/injector/injector.js:98:9)
    at async /home/kasir/projects/bugs/node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+mi_9777c7c29fb973cf338f500b14bcdf7a/node_modules/@nestjs/core/injector/instance-loader.js:56:13
    at async Promise.all (index 4)
```

## [Solution](https://github.com/kasir-barati/bugs/commit/afd530151430f9fb9cbf351c89c70ca0dfccf46f)

It looks like you're trying to pass a client instance or a factory result directly in the `forRootAsync` options object. But the expected pattern in NestJS for dynamic modules is:

- Use `inject` to `inject` dependencies (e.g., `ConfigService`).
- Use `useFactory` or `useClass` to create/fetch values using those dependencies.

Your use of `TestServiceGrpcClient`: `getTestServiceGrpcClient()`, is not standard for a dynamic module registration. NestJS will treat it as a static property, and not inject it or evaluate it at the right time.

If `getTestServiceGrpcClient()` calls the gRPC constructor with a missing or undefined address, you'll get exactly this error.
