<table>
<thead>
<tr>
<th>AWS Console</th>
<th>AWS JavaScript SDK</th>
</tr>
</thead>

<tbody>
<tr>
<td>

```yaml
- http-verb: PUT
- url: https://my-test-obj.s3.eu.amazonaws.com/me.jpg
- query-string:
  X-Amz-Algorithm: AWS4-HMAC-SHA256
  X-Amz-Content-Sha256: UNSIGNED-PAYLOAD
  X-Amz-Credential: someToken%2Feu%2Fs3%2Faws4_request
  X-Amz-Date: 20250216T135010Z
  X-Amz-Expires: 300
  X-Amz-Security-Token: some long token
  X-Amz-Signature: some long hexadecimal string
  X-Amz-SignedHeaders: content-type%3Bhost%3Bx-amz-acl%3Bx-amz-checksum-sha256%3Bx-amz-storage-class'
- headers:
  User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:134.0) Gecko/20100101 Firefox/134.0'
  Accept: application/json, text/plain, */*
  Accept-Language: en-US,en;q=0.5
  Accept-Encoding: gzip, deflate, br, zstd
  x-amz-checksum-sha256: pFHycWDglJXr+BKNXsyg62FYDeYE67v3L1/PrAO3UcE=
  Content-Type: image/jpeg
  x-amz-storage-class: STANDARD
  x-amz-acl: bucket-owner-full-control
  Content-Length: 102472
  Origin: https://eu.console.aws.amazon.com
  DNT: 1
  Sec-GPC: 1
  Connection: keep-alive
  Referer: https://eu.console.aws.amazon.com/
  Sec-Fetch-Dest: empty
  Sec-Fetch-Mode: cors
  Sec-Fetch-Site: cross-site

- response:
  Access-Control-Allow-Credentials: true
  Access-Control-Allow-Origin: https://eu.console.aws.amazon.com
  Access-Control-Expose-Headers: *
  Access-Control-Max-Age: 3000
  Content-Length: 0
  Date: Sun, 16 Feb 2025 13:50:11 GMT
  ETag: "someHash"
  Server: AmazonS3
  Vary: Origin, Access-Control-Request-Headers, Access-Control-Request-Method
  x-amz-checksum-sha256: pFHycWDglJXr+BKNXsyg62FYDeYE67v3L1/PrAO3UcE=
  x-amz-checksum-type: FULL_OBJECT
  x-amz-id-2: some hashed string which IDK what is its functionality.
  x-amz-request-id: aHexadecimalValue
  x-amz-server-side-encryption: AES256
```

- `x-amz-checksum-sha256`'s value is the thing I got from this command: `shasum -a 256 me.jpg | cut -f1 -d\ | xxd -r -p | base64`

</td>
<td>

This is the log that I get from my middleware:

```json
{
  "method": "PUT",
  "hostname": "my-test-obj.s3.eu.amazonaws.com",
  "query": { "x-id": "PutObject" },
  "headers": {
    "content-type": "video/mp4",
    "content-disposition": "attachment; filename=\"upload-me.mp4\"",
    "x-amz-sdk-checksum-algorithm": "SHA256",
    "x-amz-checksum-sha256": "OBp94YUDxEaGxd184DoFrJKbAMYeezJAzJdYl3YsRt0=",
    "x-amz-user-agent": "aws-sdk-js/3.744.0",
    "user-agent": "aws-sdk-js/3.744.0 ua/2.1 os/linux#6.1.119-1-MANJARO lang/js md/nodejs#22.12.0 api/s3#3.744.0 m/Z,b,E,e",
    "host": "my-test-obj.s3.eu.amazonaws.com",
    "amz-sdk-invocation-id": "c989edf4-425a-4456-9d46-8cb073c4e105",
    "amz-sdk-request": "attempt=1; max=3",
    "x-amz-date": "20250216T141316Z",
    "x-amz-content-sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "authorization": "AWS4-HMAC-SHA256 Credential=accessKeyId/20250216/eu/s3/aws4_request, SignedHeaders=amz-sdk-invocation-id;amz-sdk-request;content-disposition;content-type;host;x-amz-checksum-sha256;x-amz-content-sha256;x-amz-date;x-amz-sdk-checksum-algorithm;x-amz-user-agent, Signature=someLongHexadecimalValue"
  },
  "protocol": "https:",
  "path": "/80edc221-22cc-4e2a-b647-4bd05ec6dae6"
}
```

- In SDK version we do not have:
  - the filename at the end of the URL.
- `x-amz-checksum-sha256` is not what I passed to the SDK. What the what???

And when I pass `logger: console` I can see in the terminal that SDK is getting what I wrote:

```json
{
  "Bucket": "my-test-obj",
  "Key": "f4990f16-62c7-4ecd-9b4d-eb08012b95db",
  "ChecksumAlgorithm": "SHA256",
  "ContentType": "video/mp4",
  "ContentDisposition": "attachment; filename=\"upload-me.mp4\"",
  "ChecksumSHA256": "OBp94YUDxEaGxd184DoFrJKbAMYeezJAzJdYl3YsRt0="
}
```

</td>
</tr>
</tbody>

</table>

## So Can You Clarify What Is Wrong With My Code?????
