# bug-nestjs-cls-shared-storage

1. `pnpm i --frozen-lockfile`.
2. `pnpm start:dev`.
3. [localhost:3000](http://localhost:3000).

## Error Message

```bash
[Nest] 154039  - 04/21/2025, 8:01:42 PM   ERROR [ExceptionsHandler] TypeError: Cannot read properties of undefined (reading 'set')
    at CorrelationIdInterceptor.intercept (/tmp/test/node_modules/.pnpm/nestjs-backend-common@0.0.5_@nestjs+platform-express@11.0.20_graphql@16.10.0_nestjs-cls_4e32a6273ddb91005bfc666b42a32a86/node_modules/nestjs-backend-common/src/correlation-id/correlation-id.interceptor.ts:74:21)
    at nextFn (/tmp/test/node_modules/.pnpm/@nestjs+core@11.0.20_@nestjs+common@11.0.20_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+_967a245740cd19dec91127a3dcd4ee02/node_modules/@nestjs/core/interceptors/interceptors-consumer.js:23:36)
    at /tmp/test/node_modules/.pnpm/@nestjs+core@11.0.20_@nestjs+common@11.0.20_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+_967a245740cd19dec91127a3dcd4ee02/node_modules/@nestjs/core/interceptors/interceptors-consumer.js:25:40
    at Observable._subscribe (/tmp/test/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/src/internal/observable/defer.ts:54:15)
    at Observable.Observable._trySubscribe (/tmp/test/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/src/internal/Observable.ts:235:19)
    at <anonymous> (/tmp/test/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/src/internal/Observable.ts:225:18)
    at Object.errorContext (/tmp/test/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/src/internal/util/errorContext.ts:29:5)
    at Observable.Observable.subscribe (/tmp/test/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/src/internal/Observable.ts:211:5)
    at Object.mergeInternals (/tmp/test/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/src/internal/operators/mergeInternals.ts:136:10)
    at <anonymous> (/tmp/test/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/src/internal/operators/mergeMap.ts:93:42)
```

The missing part was `"emitDecoratorMetadata": true` config in my `nestjs-backend-common` library ([ref](https://github.com/Papooch/nestjs-cls/discussions/240#discussioncomment-12906169)).
