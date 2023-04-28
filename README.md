# How to replicate bug

```cmd
pnpm i --frozen-lockfile
pnpm start:dev
curl -X POST \
  'http://localhost:3000/auth' \
  --header 'Accept: */*' \
  --header 'User-Agent: Thunder Client (https://www.thunderclient.com)' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "KEYCLOAK_SECRET": {
    "authorization_server_url": 13,
    "client_id": "as",
    "secret": "asd",
    "realm": "asdf"
  }
}'
```

As you will see it converts the `KEYCLOAK_SECRET` successfully. **But** uncomment `imports: [ConfigModule.forFeature(authConfig)],` in the `auth.module.ts` and it raise an error for you.
