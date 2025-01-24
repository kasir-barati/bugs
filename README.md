# Run The App

1. `pnpm install --frozen-lockfile`.
2. `pnpm test:e2e`.
3. See the error message in your terminal:

   ```bash
      FAIL  test/cart.e2e-spec.ts
     AppController (e2e)
       ✕ / (GET) (1333 ms)
 
     ● AppController (e2e) › / (GET)
 
       Worker requires a connection
 
         20 |
         21 |     app = moduleFixture.createNestApplication();
       > 22 |     await app.init();
           |     ^
         23 |   });
         24 |
         25 |   it('/ (GET)', () => {
 
         at new Worker (../node_modules/.pnpm/bullmq@5.35.1/node_modules/bullmq/src/classes/worker.ts:220:13)
         at BullExplorer.handleProcessor (../node_modules/.pnpm/@nestjs+bullmq@11.0.1_@nestjs+common@11.0.5_reflect-metadata@0.2.2_rxjs@7.8.1__@nestjs+core@11.0.5_bullmq@5.35.1/node_modules/@nestjs/bullmq/dist/bull.explorer.js:131:24)
         at ../node_modules/.pnpm/@nestjs+bullmq@11.0.1_@nestjs+common@11.0.5_reflect-metadata@0.2.2_rxjs@7.8.1__@nestjs+core@11.0.5_bullmq@5.35.1/node_modules/@nestjs/bullmq/dist/bull.explorer.js:70:22
             at Array.forEach (<anonymous>)
         at BullExplorer.registerWorkers (../node_modules/.pnpm/@nestjs+bullmq@11.0.1_@nestjs+common@11.0.5_reflect-metadata@0.2.2_rxjs@7.8.1__@nestjs+core@11.0.5_bullmq@5.35.1/node_modules/@nestjs/bullmq/dist/bull.explorer.js:56:20)
         at BullExplorer.register (../node_modules/.pnpm/@nestjs+bullmq@11.0.1_@nestjs+common@11.0.5_reflect-metadata@0.2.2_rxjs@7.8.1__@nestjs+core@11.0.5_bullmq@5.35.1/node_modules/@nestjs/bullmq/dist/bull.explorer.js:34:14)
         at BullRegistrar.register (../node_modules/.pnpm/@nestjs+bullmq@11.0.1_@nestjs+common@11.0.5_reflect-metadata@0.2.2_rxjs@7.8.1__@nestjs+core@11.0.5_bullmq@5.35.1/node_modules/@nestjs/bullmq/dist/bull.registrar.js:22:34)
         at BullRegistrar.onModuleInit (../node_modules/.pnpm/@nestjs+bullmq@11.0.1_@nestjs+common@11.0.5_reflect-metadata@0.2.2_rxjs@7.8.1__@nestjs+core@11.0.5_bullmq@5.35.1/node_modules/@nestjs/bullmq/dist/bull.registrar.js:19:14)
         at MapIterator.iteratee (../node_modules/.pnpm/@nestjs+core@11.0.5_@nestjs+common@11.0.5_reflect-metadata@0.2.2_rxjs@7.8.1__@nestjs+platform_r7tuouw5feiz2yjyaumzh5nx34/node_modules/@nestjs/core/hooks/on-module-init.hook.js:22:43)
         at MapIterator.next (../node_modules/.pnpm/iterare@1.2.1/node_modules/iterare/src/map.ts:9:39)
         at IteratorWithOperators.next (../node_modules/.pnpm/iterare@1.2.1/node_modules/iterare/src/iterate.ts:19:28)
             at Function.from (<anonymous>)
         at IteratorWithOperators.toArray (../node_modules/.pnpm/iterare@1.2.1/node_modules/iterare/src/iterate.ts:227:22)
         at callOperator (../node_modules/.pnpm/@nestjs+core@11.0.5_@nestjs+common@11.0.5_reflect-metadata@0.2.2_rxjs@7.8.1__@nestjs+platform_r7tuouw5feiz2yjyaumzh5nx34/node_modules/@nestjs/core/hooks/on-module-init.hook.js:23:10)
         at callModuleInitHook (../node_modules/.pnpm/@nestjs+core@11.0.5_@nestjs+common@11.0.5_reflect-metadata@0.2.2_rxjs@7.8.1__@nestjs+platform_r7tuouw5feiz2yjyaumzh5nx34/node_modules/@nestjs/core/hooks/on-module-init.hook.js:43:23)
         at Proxy.callInitHook (../node_modules/.pnpm/@nestjs+core@11.0.5_@nestjs+common@11.0.5_reflect-metadata@0.2.2_rxjs@7.8.1__@nestjs+platform_r7tuouw5feiz2yjyaumzh5nx34/node_modules/@nestjs/core/nest-application-context.js:242:50)
         at Proxy.init (../node_modules/.pnpm/@nestjs+core@11.0.5_@nestjs+common@11.0.5_reflect-metadata@0.2.2_rxjs@7.8.1__@nestjs+platform_r7tuouw5feiz2yjyaumzh5nx34/node_modules/@nestjs/core/nest-application.js:100:9)
         at Object.<anonymous> (cart.e2e-spec.ts:22:5)
 
   Test Suites: 1 failed, 1 total
   Tests:       1 failed, 1 total
   Snapshots:   0 total
   Time:        2.979 s, estimated 3 s
   Ran all test suites.
   Jest did not exit one second after the test run has completed.
 
   'This usually means that there are asynchronous operations that weren't stopped in your tests. Consider running Jest with `--detectOpenHandles` to troubleshoot this issue.
   ```
