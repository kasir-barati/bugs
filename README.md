# Inject After App Initialization in Guards

1. `pnpm i --frozen-lockfile`.
2. `pnpm start:dev`.

## Error Message

```bash
[Nest] 574067  - 04/23/2025, 1:15:11 PM   ERROR [ExceptionHandler] UnknownDependenciesException [Error]: Nest can't resolve dependencies of the AuthGuard (Reflector, ?). Please make sure that the argument Symbol(auth-service) at index [1] is available in the TestModule context.

Potential solutions:
- Is TestModule a valid NestJS module?
- If Symbol(auth-service) is a provider, is it part of the current TestModule?
- If Symbol(auth-service) is exported from a separate @Module, is that module imported within TestModule?
  @Module({
    imports: [ /* the Module containing Symbol(auth-service) */ ]
  })

    at Injector.lookupComponentInParentModules (/tmp/app/node_modules/.pnpm/@nestjs+core@11.0.20_@nestjs+common@11.0.20_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+_967a245740cd19dec91127a3dcd4ee02/node_modules/@nestjs/core/injector/injector.js:262:19)
    at async Injector.resolveComponentInstance (/tmp/app/node_modules/.pnpm/@nestjs+core@11.0.20_@nestjs+common@11.0.20_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+_967a245740cd19dec91127a3dcd4ee02/node_modules/@nestjs/core/injector/injector.js:215:33)
    at async resolveParam (/tmp/app/node_modules/.pnpm/@nestjs+core@11.0.20_@nestjs+common@11.0.20_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+_967a245740cd19dec91127a3dcd4ee02/node_modules/@nestjs/core/injector/injector.js:129:38)
    at async Promise.all (index 1)
    at async Injector.resolveConstructorParams (/tmp/app/node_modules/.pnpm/@nestjs+core@11.0.20_@nestjs+common@11.0.20_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+_967a245740cd19dec91127a3dcd4ee02/node_modules/@nestjs/core/injector/injector.js:144:27)
    at async Injector.loadInstance (/tmp/app/node_modules/.pnpm/@nestjs+core@11.0.20_@nestjs+common@11.0.20_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+_967a245740cd19dec91127a3dcd4ee02/node_modules/@nestjs/core/injector/injector.js:70:13)
    at async Injector.loadInjectable (/tmp/app/node_modules/.pnpm/@nestjs+core@11.0.20_@nestjs+common@11.0.20_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+_967a245740cd19dec91127a3dcd4ee02/node_modules/@nestjs/core/injector/injector.js:94:9)
    at async /tmp/app/node_modules/.pnpm/@nestjs+core@11.0.20_@nestjs+common@11.0.20_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+_967a245740cd19dec91127a3dcd4ee02/node_modules/@nestjs/core/injector/instance-loader.js:80:13
    at async Promise.all (index 0)
    at async InstanceLoader.createInstancesOfInjectables (/tmp/app/node_modules/.pnpm/@nestjs+core@11.0.20_@nestjs+common@11.0.20_reflect-metadata@0.2.2_rxjs@7.8.2__@nestjs+_967a245740cd19dec91127a3dcd4ee02/node_modules/@nestjs/core/injector/instance-loader.js:79:9) {
  type: 'AuthGuard',
  context: {
    index: 1,
    dependencies: [
      [class Reflector],
      Symbol(auth-service)
    ],
    name: Symbol(auth-service)
  },
  metadata: {
    id: 'f77756cc819ef381ebbdc'
  },
  moduleRef: {
    id: '53b79b97d6903e252f8d4'
  }
}
```
