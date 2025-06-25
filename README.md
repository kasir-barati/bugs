# Bug

1. `pnpm install --frozen-lockfile`
2. `pnpm start:dev`

```bash
[Nest] 532185  - 06/25/2025, 1:00:37 PM   ERROR [ExceptionHandler] TypeError: Cannot read properties of undefined (reading 'getOrThrow')
    at TestModuleConfig.createTestModuleOptions (/home/kasir/projects/bugs/src/app/configs/test-module.config.ts:12:38)
    at InstanceWrapper.useFactory (/home/kasir/projects/bugs/src/test/test.module.ts:50:30)
    at Injector.instantiateClass (/home/kasir/projects/bugs/node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_class-validator@0.14.2_reflect-metadata@0.2.2_fa3816058abf5409d4a4611aa9df0fb5/node_modules/@nestjs/core/injector/injector.js:376:55)
    at callback (/home/kasir/projects/bugs/node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_class-validator@0.14.2_reflect-metadata@0.2.2_fa3816058abf5409d4a4611aa9df0fb5/node_modules/@nestjs/core/injector/injector.js:65:45)
    at async Injector.resolveConstructorParams (/home/kasir/projects/bugs/node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_class-validator@0.14.2_reflect-metadata@0.2.2_fa3816058abf5409d4a4611aa9df0fb5/node_modules/@nestjs/core/injector/injector.js:145:24)
    at async Injector.loadInstance (/home/kasir/projects/bugs/node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_class-validator@0.14.2_reflect-metadata@0.2.2_fa3816058abf5409d4a4611aa9df0fb5/node_modules/@nestjs/core/injector/injector.js:70:13)
    at async Injector.loadProvider (/home/kasir/projects/bugs/node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_class-validator@0.14.2_reflect-metadata@0.2.2_fa3816058abf5409d4a4611aa9df0fb5/node_modules/@nestjs/core/injector/injector.js:98:9)
    at async /home/kasir/projects/bugs/node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_class-validator@0.14.2_reflect-metadata@0.2.2_fa3816058abf5409d4a4611aa9df0fb5/node_modules/@nestjs/core/injector/instance-loader.js:56:13
    at async Promise.all (index 4)
    at async InstanceLoader.createInstancesOfProviders (/home/kasir/projects/bugs/node_modules/.pnpm/@nestjs+core@11.1.3_@nestjs+common@11.1.3_class-validator@0.14.2_reflect-metadata@0.2.2_fa3816058abf5409d4a4611aa9df0fb5/node_modules/@nestjs/core/injector/instance-loader.js:55:9)
```
