# Bugs

So in NestJS when we have a duplex stream in gRPC we have to use `@GrpcStreamMethod` decorator for some reasons. I added plenty logs to show that the complete handler is not being called while my e2e test is calling `end` method of the returned duplex stream.

```bash
$ pnpm test:e2e

> bugs@0.0.1 test:e2e /home/kasir/projects/bugs
> jest --config ./test/jest-e2e.json

  console.log
    E2E test file -- we received data: {}

      at ClientDuplexStreamImpl.<anonymous> (app.e2e-spec.ts:67:19)

  console.log
    E2E test file -- we received data: {}

      at ClientDuplexStreamImpl.<anonymous> (app.e2e-spec.ts:67:19)

 FAIL  test/app.e2e-spec.ts (6.453 s)
  AppController (e2e)
    ✕ should upload the file (5002 ms)

  ● AppController (e2e) › should upload the file

    thrown: "Exceeded timeout of 5000 ms for a test.
    Add a timeout value to this test to increase the timeout, if this is a long-running test. See https://jestjs.io/docs/api#testname-fn-timeout."

      58 |   });
      59 |
    > 60 |   it('should upload the file', async () => {
         |   ^
      61 |     const metadata = new Metadata();
      62 |     const duplexStream = client.upload(metadata);
      63 |

      at app.e2e-spec.ts:60:3
      at Object.<anonymous> (app.e2e-spec.ts:12:1)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        6.613 s, estimated 7 s
Ran all test suites.
Jest did not exit one second after the test run has completed.

'This usually means that there are asynchronous operations that weren't stopped in your tests. Consider running Jest with `--detectOpenHandles` to troubleshoot this issue.
```

## Reproduce

1. `pnpm install --frozen-lockfile`.
2. `pnpm  grpc:gen`.
3. `pnpm test:e2e`.
