# NestJS + gRPC + Bidirectional streams

Steps to reproduce it:

```bash
mkdir ./src/proto/interfaces
pnpm install --frozen-lockfile
pnpm grpc:gen
pnpm start:dev
pnpm test:integration
```

Look at the logs now in the terminal.
