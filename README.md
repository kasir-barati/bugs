# Status:

**Resolved**

It is a normal behavior. Just like any data fetching, when the component first loads it won't have the data, but then when it comes in it will re-render with the new data.

```ts
const { isAuthenticated, isLoading } = useAuth0();
// Use isLoading in conjunction to isAuthenticated
```

# How to start the project?

```cmd
pnpm i --frozen-lockfile
pnpm dev
```

Then open [https://127.0.0.1:5173/](https://127.0.0.1:5173/) in your browser

# The picture

![Bug picture](./src/assets/Untitled.png)
