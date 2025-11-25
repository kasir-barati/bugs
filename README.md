# Pre-commit Conventional Commit Hook

It seems like I have to manually install this hook on top of other hooks!

https://github.com/compilerla/conventional-pre-commit/issues/145

## Reproduce It

1. Clone the repo.
2. Checkout to `pre-commit-conventional-commit-hook`.
3. Change something and try to commit it with invalid commit message, e.g. "some msg" or "test".
4. You should not see any error.
5. Register the hook manually: `pre-commit install --hook-type commit-msg`.
6. Retry third step, this time you should see an error!

> [!NOTE]
>
> I also tried `pre-commit install --install-hooks` and it still does not work, unless I say `pre-commit install --hook-type commit-msg`!
