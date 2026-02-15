# type-only Import

If you try to inject a service like this: 

```ts
import type { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DummyService {
  constructor(private readonly amqpConnection: AmqpConnection) {}
}
```

You will get this error:

```cmd
[10:35:54 AM] File change detected. Starting incremental compilation...
app-1  | 
app-1  | [10:35:54 AM] Found 0 errors. Watching for file changes.
app-1  | 
app-1  | [Nest] 46  - 02/15/2026, 10:35:54 AM     LOG [NestFactory] Starting Nest application...
app-1  | [Nest] 46  - 02/15/2026, 10:35:54 AM     LOG [InstanceLoader] AppModule dependencies initialized +8ms
app-1  | [Nest] 46  - 02/15/2026, 10:35:54 AM     LOG [InstanceLoader] MessagingModule dependencies initialized +0ms
app-1  | [Nest] 46  - 02/15/2026, 10:35:54 AM   ERROR [ExceptionHandler] UnknownDependenciesException [Error]: Nest can't resolve dependencies of the DummyService (?). Please make sure that the argument Function at index [0] is available in the DummyModule context.
app-1  | 
app-1  | Potential solutions:
app-1  | - Is DummyModule a valid NestJS module?
app-1  | - If Function is a provider, is it part of the current DummyModule?
app-1  | - If Function is exported from a separate @Module, is that module imported within DummyModule?
app-1  |   @Module({
app-1  |     imports: [ /* the Module containing Function */ ]
app-1  |   })
app-1  | 
app-1  | For more common dependency resolution issues, see: https://docs.nestjs.com/faq/common-errors
app-1  |     at Injector.lookupComponentInParentModules (/app/node_modules/.pnpm/@nestjs+core@11.1.13_@nestjs+common@11.1.13_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+_8eee95f8ec8b2b098d54e5dbace7e3f0/node_modules/@nestjs/core/injector/injector.js:290:19)
app-1  |     at async resolveParam (/app/node_modules/.pnpm/@nestjs+core@11.1.13_@nestjs+common@11.1.13_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+_8eee95f8ec8b2b098d54e5dbace7e3f0/node_modules/@nestjs/core/injector/injector.js:140:38)
app-1  |     at async Promise.all (index 0)
app-1  |     at async Injector.resolveConstructorParams (/app/node_modules/.pnpm/@nestjs+core@11.1.13_@nestjs+common@11.1.13_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+_8eee95f8ec8b2b098d54e5dbace7e3f0/node_modules/@nestjs/core/injector/injector.js:169:27)
app-1  |     at async Injector.loadInstance (/app/node_modules/.pnpm/@nestjs+core@11.1.13_@nestjs+common@11.1.13_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+_8eee95f8ec8b2b098d54e5dbace7e3f0/node_modules/@nestjs/core/injector/injector.js:75:13)
app-1  |     at async Injector.loadProvider (/app/node_modules/.pnpm/@nestjs+core@11.1.13_@nestjs+common@11.1.13_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+_8eee95f8ec8b2b098d54e5dbace7e3f0/node_modules/@nestjs/core/injector/injector.js:103:9)
app-1  |     at async /app/node_modules/.pnpm/@nestjs+core@11.1.13_@nestjs+common@11.1.13_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+_8eee95f8ec8b2b098d54e5dbace7e3f0/node_modules/@nestjs/core/injector/instance-loader.js:56:13
app-1  |     at async Promise.all (index 3)
app-1  |     at async InstanceLoader.createInstancesOfProviders (/app/node_modules/.pnpm/@nestjs+core@11.1.13_@nestjs+common@11.1.13_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+_8eee95f8ec8b2b098d54e5dbace7e3f0/node_modules/@nestjs/core/injector/instance-loader.js:55:9)
app-1  |     at async /app/node_modules/.pnpm/@nestjs+core@11.1.13_@nestjs+common@11.1.13_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+_8eee95f8ec8b2b098d54e5dbace7e3f0/node_modules/@nestjs/core/injector/instance-loader.js:40:13 {
app-1  |   type: 'DummyService',
app-1  |   context: {
app-1  |     index: 0,
app-1  |     dependencies: [
app-1  |       [Function: Function]
app-1  |     ],
app-1  |     name: [Function: Function]
app-1  |   },
app-1  |   metadata: {
app-1  |     id: '31d209eea059acc6763a8'
app-1  |   },
app-1  |   moduleRef: {
app-1  |     id: 'fd5a3e8435243a7517673'
app-1  |   }
app-1  | }
```

---

Same applies to your custom modules/services:

```ts
import { Injectable, OnModuleInit } from "@nestjs/common";
import type { DummyService } from "../dummy";

@Injectable()
export class Dummy2Service implements OnModuleInit {
  constructor(private readonly dummyService: DummyService) {}

  onModuleInit() {
    console.log("Dummy2Service initialized " + this.dummyService.tempMethod());
  }
}
```

```cmd
[10:43:29 AM] File change detected. Starting incremental compilation...
app-1  | 
app-1  | [10:43:29 AM] Found 0 errors. Watching for file changes.
app-1  | 
app-1  | [Nest] 401  - 02/15/2026, 10:43:29 AM     LOG [NestFactory] Starting Nest application...
app-1  | [Nest] 401  - 02/15/2026, 10:43:29 AM     LOG [InstanceLoader] AppModule dependencies initialized +8ms
app-1  | [Nest] 401  - 02/15/2026, 10:43:29 AM     LOG [InstanceLoader] MessagingModule dependencies initialized +0ms
app-1  | [Nest] 401  - 02/15/2026, 10:43:29 AM   ERROR [ExceptionHandler] UnknownDependenciesException [Error]: Nest can't resolve dependencies of the Dummy2Service (?). Please make sure that the argument Function at index [0] is available in the Dummy2Module context.
app-1  | 
app-1  | Potential solutions:
app-1  | - Is Dummy2Module a valid NestJS module?
app-1  | - If Function is a provider, is it part of the current Dummy2Module?
app-1  | - If Function is exported from a separate @Module, is that module imported within Dummy2Module?
app-1  |   @Module({
app-1  |     imports: [ /* the Module containing Function */ ]
app-1  |   })
app-1  | 
app-1  | For more common dependency resolution issues, see: https://docs.nestjs.com/faq/common-errors
app-1  |     at Injector.lookupComponentInParentModules (/app/node_modules/.pnpm/@nestjs+core@11.1.13_@nestjs+common@11.1.13_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+_8eee95f8ec8b2b098d54e5dbace7e3f0/node_modules/@nestjs/core/injector/injector.js:290:19)
app-1  |     at async resolveParam (/app/node_modules/.pnpm/@nestjs+core@11.1.13_@nestjs+common@11.1.13_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+_8eee95f8ec8b2b098d54e5dbace7e3f0/node_modules/@nestjs/core/injector/injector.js:140:38)
app-1  |     at async Promise.all (index 0)
app-1  |     at async Injector.resolveConstructorParams (/app/node_modules/.pnpm/@nestjs+core@11.1.13_@nestjs+common@11.1.13_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+_8eee95f8ec8b2b098d54e5dbace7e3f0/node_modules/@nestjs/core/injector/injector.js:169:27)
app-1  |     at async Injector.loadInstance (/app/node_modules/.pnpm/@nestjs+core@11.1.13_@nestjs+common@11.1.13_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+_8eee95f8ec8b2b098d54e5dbace7e3f0/node_modules/@nestjs/core/injector/injector.js:75:13)
app-1  |     at async Injector.loadProvider (/app/node_modules/.pnpm/@nestjs+core@11.1.13_@nestjs+common@11.1.13_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+_8eee95f8ec8b2b098d54e5dbace7e3f0/node_modules/@nestjs/core/injector/injector.js:103:9)
app-1  |     at async /app/node_modules/.pnpm/@nestjs+core@11.1.13_@nestjs+common@11.1.13_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+_8eee95f8ec8b2b098d54e5dbace7e3f0/node_modules/@nestjs/core/injector/instance-loader.js:56:13
app-1  |     at async Promise.all (index 3)
app-1  |     at async InstanceLoader.createInstancesOfProviders (/app/node_modules/.pnpm/@nestjs+core@11.1.13_@nestjs+common@11.1.13_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+_8eee95f8ec8b2b098d54e5dbace7e3f0/node_modules/@nestjs/core/injector/instance-loader.js:55:9)
app-1  |     at async /app/node_modules/.pnpm/@nestjs+core@11.1.13_@nestjs+common@11.1.13_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+_8eee95f8ec8b2b098d54e5dbace7e3f0/node_modules/@nestjs/core/injector/instance-loader.js:40:13 {
app-1  |   type: 'Dummy2Service',
app-1  |   context: {
app-1  |     index: 0,
app-1  |     dependencies: [
app-1  |       [Function: Function]
app-1  |     ],
app-1  |     name: [Function: Function]
app-1  |   },
app-1  |   metadata: {
app-1  |     id: '0f18bdb7e2ee255393e61'
app-1  |   },
app-1  |   moduleRef: {
app-1  |     id: '4afe4a9551ab58dc1bc50'
app-1  |   }
app-1  | }
```

## Fix

You need to change the type-only import to this:

<table><thead><tr><th>Your custom service</th><th>3rd party service</th></tr></thead>
<tbody><tr><td>

```ts
import { Injectable, OnModuleInit } from "@nestjs/common";
import { DummyService } from "../dummy";

@Injectable()
export class Dummy2Service implements OnModuleInit {
  constructor(private readonly dummyService: DummyService) {}

  onModuleInit() {
    console.log("Dummy2Service initialized " + this.dummyService.tempMethod());
  }
}
```

</td><td>

```ts
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DummyService {
  constructor(private readonly amqpConnection: AmqpConnection) {}
}
```

</td></tr></tbody></table>