# Issues

- Just check `.env` file [here](./apps/nest/.env). You guessed, I am not sure adding more env to this file is doable thanks to how I had to tell webpack and node that they need to used a different loader. Read more here: https://github.com/webpack/webpack-cli/issues/2458#issuecomment-811339474
- Had to install dozens of unnecessary 3rd party libs just to be able to do `nx serve nest`. Check my [`package.json` deps](./package.json#L12)! It was constantly complaining about not being able to access them.
- Check my `tsconfig*.json` files inside my nest app.
- And on top of all of these I was not able to use `import.meta.dirname` inside `webpack.config.ts` which is fine and everything but it made my codebase even worse.

## Conclusion

With the warnings that we get from Vite about removing support of CommonJS in V6 and also this fragile conf which is not even practical (who's gonna install all those 3rd party libs to just get ESM + NestJS + Nx working?) I am not gonna stop and see how Nx gonna work. I mean I do not see why they have added webpack to NestJS. Does not make sense to me.

We should just ditch the whole webpack in NestJS, but I know that there is a reason for having webpack in NestJS.
