# Pre-commit Conventional Commit Hook

It seems like I have to manually install this hook on top of other hooks!

## Reproduce It

1. Clone the repo.
2. Checkout to `pre-commit-conventional-commit-hook`.
3. Change something and try to commit it with invalid commit message, e.g. "some msg" or "test".
4. You should not see any error.
5. Register the hook manually: `pre-commit install --hook-type commit-msg`.
6. Retry third step, this time you should see an error!
