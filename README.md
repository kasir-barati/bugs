# How to start the application

1. Clone the repository.
2. Run the command `pnpm i --frozen-lockfile`.
3. Run the command `docker compose up -d`.
4. Run the command `pnpm run start:dev`.
5. In your terminal you can NOT see `onModuleInit` log!

## I was missing the `await app.init()`!
