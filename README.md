# Stackoverflow Q&A

https://stackoverflow.com/questions/79440191/invalid-checksum-when-using-multipart-upload-with-full-object-checksum-in-nodejs?noredirect=1#comment140099479_79440191

> [!NOTE]
>
> Other places I have asked the same question but since they are sometimes a bit different I will link them here:
>
> - [Discord, Reactiflux server](https://discord.com/channels/102860784329052160/145170347921113088/1339859485560147999).
> - [Discord, AWS server](https://discord.com/channels/423842546947457024/1339901868087840789/1339901868087840789).
> - [GitHub discussions, Minio, CompleteMultipartUpload fails with InvalidPart](https://github.com/minio/minio/discussions/16770).
> - [GitHub discussions, AWS JS SDK, InvalidPart: One or more of the specified parts could not be found. The part may not have been uploaded, or the specified entity tag may not match the part's entity tag](https://github.com/aws/aws-sdk-js-v3/discussions/6883).
> - [AWS, XAmzContentChecksumMismatch: The provided 'x-amz-checksum' header does not match what was computed.](https://repost.aws/questions/QU5H7iryj4S3q4u5-UCsmasQ/xamzcontentchecksummismatch-the-provided-x-amz-checksum-header-does-not-match-what-was-computed).

## Results

- Checksum should be a Base64 encoded, 32-bit CRC32 checksum of the object ([AWS S3 docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-s3/Interface/CompleteMultipartUploadCommandInput/)). Read [this Stackoverflow Q&A](https://stackoverflow.com/a/79440513/8784518) for more details.

# Error messages

<details>
<summary>
<code>InvalidArgument: Invalid arguments provided for test/3e3c92c3-26cb-49b6-a41b-406a0e218800: (invalid/unknown checksum sent: invalid checksum</code>
</summary>

```bash
[kasir@kasir-lifebooke736 bugs]$ pnpx ts-node simplified.ts
/home/kasir/projects/bugs/node_modules/.pnpm/@smithy+smithy-client@4.1.3/node_modules/@smithy/smithy-client/dist-cjs/index.js:867
  const response = new exceptionCtor({
                   ^
InvalidArgument: Invalid arguments provided for test/3e3c92c3-26cb-49b6-a41b-406a0e218800: (invalid/unknown checksum sent: invalid checksum)
    at throwDefaultError (/home/kasir/projects/bugs/node_modules/.pnpm/@smithy+smithy-client@4.1.3/node_modules/@smithy/smithy-client/dist-cjs/index.js:867:20)
    at /home/kasir/projects/bugs/node_modules/.pnpm/@smithy+smithy-client@4.1.3/node_modules/@smithy/smithy-client/dist-cjs/index.js:876:5
    at de_CommandError (/home/kasir/projects/bugs/node_modules/.pnpm/@aws-sdk+client-s3@3.744.0_aws-crt@1.25.3/node_modules/@aws-sdk/client-s3/dist-cjs/index.js:4970:14)
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
    requestId: '182420C19E2100F0',
    extendedRequestId: 'dd9025bab4ad464b049177c95eb6ebf374d3b3fd1af9251148b658df7ac2e3e8',
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  },
  Code: 'InvalidArgument',
  Key: '3e3c92c3-26cb-49b6-a41b-406a0e218800',
  BucketName: 'test',
  Resource: '/test/3e3c92c3-26cb-49b6-a41b-406a0e218800',
  RequestId: '182420C19E2100F0',
  HostId: 'dd9025bab4ad464b049177c95eb6ebf374d3b3fd1af9251148b658df7ac2e3e8'
}
```

</details>

<details>
<summary>
<code>InvalidPart: One or more of the specified parts could not be found.  The part may not have been uploaded, or the specified entity tag may not match the part's entity tag.</code>
</summary>

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

</details>

# How to Run the `main.ts`

1. `pnpm install --frozen-lockfile`
2. Change the `fileName` to point to an absolute path.
   - **It should be bigger than 5MB**.
3. `docker compose up -d`
4. Create a bucket named "test".
5. `pnpm start`.

# How to Run the `simplified.ts`

1. `pnpm install --frozen-lockfile`
2. Change the `fileName` to point to an absolute path.
   - **It should be bigger than 5MB**.
3. `docker compose up -d`
4. Create a bucket named "test".
5. `pnpx simplified`.
