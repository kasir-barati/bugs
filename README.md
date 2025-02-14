# Steps to reproduce

```bash
pnpm install --frozen-lockfile
docker compose up -d
```

Create a bucket named "test" in your Minio dashboard, username and password are the same: adminadmin

```bash
pnpm start
```

## Logs

```bash
/home/kasir/projects/bugs/node_modules/.pnpm/@smithy+smithy-client@4.1.3/node_modules/@smithy/smithy-client/dist-cjs/index.js:867
  const response = new exceptionCtor({
                   ^
InvalidPart: One or more of the specified parts could not be found.  The part may not have been uploaded, or the specified entity tag may not match the part's entity tag.
    at throwDefaultError (/home/kasir/projects/bugs/node_modules/.pnpm/@smithy+smithy-client@4.1.3/node_modules/@smithy/smithy-client/dist-cjs/index.js:867:20)
    at /home/kasir/projects/bugs/node_modules/.pnpm/@smithy+smithy-client@4.1.3/node_modules/@smithy/smithy-client/dist-cjs/index.js:876:5
    at de_CommandError (/home/kasir/projects/bugs/node_modules/.pnpm/@aws-sdk+client-s3@3.744.0/node_modules/@aws-sdk/client-s3/dist-cjs/index.js:4970:14)
    at processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async /home/kasir/projects/bugs/node_modules/.pnpm/@smithy+middleware-serde@4.0.2/node_modules/@smithy/middleware-serde/dist-cjs/index.js:35:20
    at async /home/kasir/projects/bugs/node_modules/.pnpm/@aws-sdk+middleware-sdk-s3@3.744.0/node_modules/@aws-sdk/middleware-sdk-s3/dist-cjs/index.js:483:18
    at async /home/kasir/projects/bugs/node_modules/.pnpm/@smithy+middleware-retry@4.0.4/node_modules/@smithy/middleware-retry/dist-cjs/index.js:321:38
    at async /home/kasir/projects/bugs/node_modules/.pnpm/@aws-sdk+middleware-sdk-s3@3.744.0/node_modules/@aws-sdk/middleware-sdk-s3/dist-cjs/index.js:109:22
    at async /home/kasir/projects/bugs/node_modules/.pnpm/@aws-sdk+middleware-sdk-s3@3.744.0/node_modules/@aws-sdk/middleware-sdk-s3/dist-cjs/index.js:136:14
    at async /home/kasir/projects/bugs/node_modules/.pnpm/@aws-sdk+middleware-logger@3.734.0/node_modules/@aws-sdk/middleware-logger/dist-cjs/index.js:33:22 {
  '$fault': 'client',
  '$metadata': {
    httpStatusCode: 400,
    requestId: '1823FF7D5AB53B0B',
    extendedRequestId: 'dd9025bab4ad464b049177c95eb6ebf374d3b3fd1af9251148b658df7ac2e3e8',
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  },
  Code: 'InvalidPart',
  Key: '67aa9fb3-86a8-459f-9a63-b23c9c2a22f7',
  BucketName: 'test',
  Resource: '/test/67aa9fb3-86a8-459f-9a63-b23c9c2a22f7',
  RequestId: '1823FF7D5AB53B0B',
  HostId: 'dd9025bab4ad464b049177c95eb6ebf374d3b3fd1af9251148b658df7ac2e3e8'
}
 ELIFECYCLE  Command failed with exit code 1.
```
