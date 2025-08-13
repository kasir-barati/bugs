# Bugs

- [Discord](https://discord.com/channels/520622812742811698/1404511434515419206/1404511434515419206).
- [Reddit](https://www.reddit.com/r/nestjs/comments/1mnjri6/mongoose_dynamic_module/).
- [Stackoverflow](https://stackoverflow.com/questions/79732340/generic-mongoose-dynamic-module-cannot-inject-options).

Just install the deps:

```cmd
pnpm i --frozen-lockfile
```

## Dynamic Module

<details>
<summary>The first try</summary>

- [`mongo.module.ts`](https://github.com/kasir-barati/bugs/blob/875845bbaf0e1440893b9fd387551321d8088c1c/src/mongo/mongo.module.ts#L28-L34).
- [`mongo.module.ts`](https://github.com/kasir-barati/bugs/blob/832140936a45f945963468bfde5d6570e880cfd5/src/mongo/mongo.module.ts).

```bash
$ pnpm test:e2e

> bugs@0.0.1 test:e2e /home/kasir/projects/bugs
> jest --config ./test/jest-e2e.json

 FAIL  test/app.e2e-spec.ts
  AppController (e2e)
    ✕ / (GET) (6 ms)

  ● AppController (e2e) › / (GET)

    Nest can't resolve dependencies of the MongooseModuleOptions (?). Please make sure that the argument Symbol(MONGO_MODULE_OPTIONS) at index [0] is available in the MongooseCoreModule context.

    Potential solutions:
    - Is MongooseCoreModule a valid NestJS module?
    - If Symbol(MONGO_MODULE_OPTIONS) is a provider, is it part of the current MongooseCoreModule?
    - If Symbol(MONGO_MODULE_OPTIONS) is exported from a separate @Module, is that module imported within MongooseCoreModule?
      @Module({
        imports: [ /* the Module containing Symbol(MONGO_MODULE_OPTIONS) */ ]
      })

       9 |
      10 |   beforeEach(async () => {
    > 11 |     const moduleFixture: TestingModule = await Test.createTestingModule({
         |                                          ^
      12 |       imports: [AppModule],
      13 |     }).compile();
      14 |

      at TestingInjector.lookupComponentInParentModules (../node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+mi_9777c7c29fb973cf338f500b14bcdf7a/node_modules/@nestjs/core/injector/injector.js:262:19)
      at TestingInjector.resolveComponentInstance (../node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+mi_9777c7c29fb973cf338f500b14bcdf7a/node_modules/@nestjs/core/injector/injector.js:215:33)
      at TestingInjector.resolveComponentInstance (../node_modules/.pnpm/@nestjs+testing@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs_b3fef3ca33702748e9966e9f5369bb17/node_modules/@nestjs/testing/testing-injector.js:19:45)
      at resolveParam (../node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+mi_9777c7c29fb973cf338f500b14bcdf7a/node_modules/@nestjs/core/injector/injector.js:129:38)
          at async Promise.all (index 0)
      at TestingInjector.resolveConstructorParams (../node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+mi_9777c7c29fb973cf338f500b14bcdf7a/node_modules/@nestjs/core/injector/injector.js:144:27)
      at TestingInjector.loadInstance (../node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+mi_9777c7c29fb973cf338f500b14bcdf7a/node_modules/@nestjs/core/injector/injector.js:70:13)
      at TestingInjector.loadProvider (../node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+mi_9777c7c29fb973cf338f500b14bcdf7a/node_modules/@nestjs/core/injector/injector.js:98:9)
      at ../node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+mi_9777c7c29fb973cf338f500b14bcdf7a/node_modules/@nestjs/core/injector/instance-loader.js:56:13
          at async Promise.all (index 3)
      at TestingInstanceLoader.createInstancesOfProviders (../node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+mi_9777c7c29fb973cf338f500b14bcdf7a/node_modules/@nestjs/core/injector/instance-loader.js:55:9)
      at ../node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+mi_9777c7c29fb973cf338f500b14bcdf7a/node_modules/@nestjs/core/injector/instance-loader.js:40:13
          at async Promise.all (index 4)
      at TestingInstanceLoader.createInstances (../node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+mi_9777c7c29fb973cf338f500b14bcdf7a/node_modules/@nestjs/core/injector/instance-loader.js:39:9)
      at TestingInstanceLoader.createInstancesOfDependencies (../node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+mi_9777c7c29fb973cf338f500b14bcdf7a/node_modules/@nestjs/core/injector/instance-loader.js:22:13)
      at TestingInstanceLoader.createInstancesOfDependencies (../node_modules/.pnpm/@nestjs+testing@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs_b3fef3ca33702748e9966e9f5369bb17/node_modules/@nestjs/testing/testing-instance-loader.js:9:9)
      at TestingModuleBuilder.createInstancesOfDependencies (../node_modules/.pnpm/@nestjs+testing@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs_b3fef3ca33702748e9966e9f5369bb17/node_modules/@nestjs/testing/testing-module.builder.js:118:9)
      at TestingModuleBuilder.compile (../node_modules/.pnpm/@nestjs+testing@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs_b3fef3ca33702748e9966e9f5369bb17/node_modules/@nestjs/testing/testing-module.builder.js:74:9)
      at Object.<anonymous> (app.e2e-spec.ts:11:42)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        1.901 s
Ran all test suites.
 ELIFECYCLE  Command failed with exit code 1.
```

</details>

```bash
$ pnpm test:e2e

> bugs@0.0.1 test:e2e /home/kasir/projects/bugs
> jest --config ./test/jest-e2e.json

 FAIL  test/app.e2e-spec.ts
  AppController (e2e)
    ✕ / (GET) (6 ms)

  ● AppController (e2e) › / (GET)

    Nest can't resolve dependencies of the MongooseModuleOptions (?). Please make sure that the argument "CONFIGURABLE_MODULE_OPTIONS[509e72d77b436c9f1c07f]" at index [0] is available in the MongooseCoreModule context.

    Potential solutions:
    - Is MongooseCoreModule a valid NestJS module?
    - If "CONFIGURABLE_MODULE_OPTIONS[509e72d77b436c9f1c07f]" is a provider, is it part of the current MongooseCoreModule?
    - If "CONFIGURABLE_MODULE_OPTIONS[509e72d77b436c9f1c07f]" is exported from a separate @Module, is that module imported within MongooseCoreModule?
      @Module({
        imports: [ /* the Module containing "CONFIGURABLE_MODULE_OPTIONS[509e72d77b436c9f1c07f]" */ ]
      })

       9 |
      10 |   beforeEach(async () => {
    > 11 |     const moduleFixture: TestingModule = await Test.createTestingModule({
         |                                          ^
      12 |       imports: [AppModule],
      13 |     }).compile();
      14 |

      at TestingInjector.lookupComponentInParentModules (../node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+mi_9777c7c29fb973cf338f500b14bcdf7a/node_modules/@nestjs/core/injector/injector.js:262:19)
      at TestingInjector.resolveComponentInstance (../node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+mi_9777c7c29fb973cf338f500b14bcdf7a/node_modules/@nestjs/core/injector/injector.js:215:33)
      at TestingInjector.resolveComponentInstance (../node_modules/.pnpm/@nestjs+testing@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs_b3fef3ca33702748e9966e9f5369bb17/node_modules/@nestjs/testing/testing-injector.js:19:45)
      at resolveParam (../node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+mi_9777c7c29fb973cf338f500b14bcdf7a/node_modules/@nestjs/core/injector/injector.js:129:38)
          at async Promise.all (index 0)
      at TestingInjector.resolveConstructorParams (../node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+mi_9777c7c29fb973cf338f500b14bcdf7a/node_modules/@nestjs/core/injector/injector.js:144:27)
      at TestingInjector.loadInstance (../node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+mi_9777c7c29fb973cf338f500b14bcdf7a/node_modules/@nestjs/core/injector/injector.js:70:13)
      at TestingInjector.loadProvider (../node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+mi_9777c7c29fb973cf338f500b14bcdf7a/node_modules/@nestjs/core/injector/injector.js:98:9)
      at ../node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+mi_9777c7c29fb973cf338f500b14bcdf7a/node_modules/@nestjs/core/injector/instance-loader.js:56:13
          at async Promise.all (index 3)
      at TestingInstanceLoader.createInstancesOfProviders (../node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+mi_9777c7c29fb973cf338f500b14bcdf7a/node_modules/@nestjs/core/injector/instance-loader.js:55:9)
      at ../node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+mi_9777c7c29fb973cf338f500b14bcdf7a/node_modules/@nestjs/core/injector/instance-loader.js:40:13
          at async Promise.all (index 5)
      at TestingInstanceLoader.createInstances (../node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+mi_9777c7c29fb973cf338f500b14bcdf7a/node_modules/@nestjs/core/injector/instance-loader.js:39:9)
      at TestingInstanceLoader.createInstancesOfDependencies (../node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+mi_9777c7c29fb973cf338f500b14bcdf7a/node_modules/@nestjs/core/injector/instance-loader.js:22:13)
      at TestingInstanceLoader.createInstancesOfDependencies (../node_modules/.pnpm/@nestjs+testing@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs_b3fef3ca33702748e9966e9f5369bb17/node_modules/@nestjs/testing/testing-instance-loader.js:9:9)
      at TestingModuleBuilder.createInstancesOfDependencies (../node_modules/.pnpm/@nestjs+testing@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs_b3fef3ca33702748e9966e9f5369bb17/node_modules/@nestjs/testing/testing-module.builder.js:118:9)
      at TestingModuleBuilder.compile (../node_modules/.pnpm/@nestjs+testing@11.1.3_@nestjs+common@11.1.3_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs_b3fef3ca33702748e9966e9f5369bb17/node_modules/@nestjs/testing/testing-module.builder.js:74:9)
      at Object.<anonymous> (app.e2e-spec.ts:11:42)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        1.547 s
Ran all test suites.
 ELIFECYCLE  Command failed with exit code 1.
```
