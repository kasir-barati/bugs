# Prompt

Why one works while the other does not?

```
➜  test git:(master) npm i nestjs-backend-common@latest
npm error Cannot read properties of null (reading 'matches')
npm error A complete log of this run can be found in: /home/mjb/.npm/_logs/2026-02-21T20_28_22_477Z-debug-0.log
➜  test git:(master) pnpm i nestjs-backend-common@latest
 WARN  4 deprecated subdependencies found: glob@10.5.0, glob@7.2.3, inflight@1.0.6, subscriptions-transport-ws@0.11.0
Packages: +1 -1
+-
Progress: resolved 733, reused 713, downloaded 1, added 1, done

dependencies:
- nestjs-backend-common 0.4.0
+ nestjs-backend-common 1.0.0

Done in 1.4s using pnpm v10.28.2
```

## Answer: Why pnpm Works but npm Fails

I've identified the root cause of the issue by examining the npm debug log. Here's what's happening:

### The Problem

**npm is failing with this error:**

```
TypeError: Cannot read properties of null (reading 'matches')
    at Link.matches (/home/mjb/.nvm/versions/node/v24.13.0/lib/node_modules/npm/node_modules/@npmcli/arborist/lib/node.js:1186:41)
```

This is a **bug in npm v11.6.2** when combined with **Node.js v24.13.0**. The error occurs during dependency resolution when npm's arborist (dependency tree builder) tries to deduplicate dependencies for the `nestjs-backend-common@1.0.0` package.

### Why pnpm Works

**pnpm v10.28.2** works perfectly because:

1. **Different dependency resolution algorithm** - pnpm uses a completely different approach with a content-addressable store and symlinks
2. **No arborist dependency** - pnpm doesn't use npm's arborist library that contains the bug
3. **More robust handling** - pnpm's resolution algorithm is more resilient to edge cases in dependency trees

### Root Cause

The `nestjs-backend-common` package has a complex dependency tree with multiple peer dependencies and nested dependencies. When npm tries to build the ideal dependency tree, it encounters a Link node where the target reference is unexpectedly `null`, causing the crash when it tries to call `.matches()` on it.

### Solutions

You have several options:

**Option 1: Continue using pnpm (Recommended)**

- Since pnpm is already working, this is the simplest solution
- pnpm is generally faster and more disk-efficient than npm anyway
- No action needed!

**Option 2: Downgrade npm**

- Try using an older version of npm that doesn't have this bug
- Run: `npm install -g npm@10` or `npm install -g npm@9`

**Option 3: Update to a newer version**

- Check if there's a newer npm version that fixes this bug
- Run: `npm install -g npm@latest`

**Option 4: Use Node.js v22 or v20 LTS**

- The combination of Node.js v24.13.0 + npm v11.6.2 appears problematic
- Node v24 is very recent; v22 LTS is more stable

Would you like me to help you implement any of these solutions, or do you have questions about the technical details?

<details><summary>Follow up question: <b>What do you mean by "deduplicate dependencies"?</b></summary>

## Dependency Deduplication Explained

Great question! Let me explain with a practical example:

### The Problem Deduplication Solves

Imagine you're installing a package that has this dependency structure:

```
your-project
├── package-a@1.0.0
│   └── lodash@4.17.21
├── package-b@2.0.0
│   └── lodash@4.17.21
└── package-c@3.0.0
    └── lodash@4.17.21
```

**Without deduplication**, npm would install lodash **three times**:
```
node_modules/
├── package-a/
│   └── node_modules/
│       └── lodash/  (4.17.21 - copy #1)
├── package-b/
│   └── node_modules/
│       └── lodash/  (4.17.21 - copy #2)
└── package-c/
    └── node_modules/
        └── lodash/  (4.17.21 - copy #3)
```

This wastes disk space and makes installs slower!

**With deduplication**, npm realizes all three packages want the same version of lodash, so it installs it **once** at the top level:

```
node_modules/
├── lodash/  (4.17.21 - shared by all!)
├── package-a/
├── package-b/
└── package-c/
```

All three packages can now share the same lodash installation.

### How npm Does This

During installation, npm's "arborist" (dependency tree builder):
1. **Analyzes** all dependency requirements
2. **Identifies** packages that multiple dependencies need
3. **Checks** if versions are compatible (e.g., `^4.0.0` can share with `^4.17.0`)
4. **Hoists** (moves up) shared dependencies to avoid duplication
5. **Creates links** when needed for more complex scenarios

### The Bug in Your Case

The bug occurs at step #5. When npm encounters a "Link" node (a special internal structure representing a symlink or reference to another package location), it tries to check if this link `.matches()` another dependency to determine if it can be deduplicated. However, the link's target is unexpectedly `null`, causing:

```javascript
// npm's code tries to do:
if (link.target.matches(otherDependency)) { ... }
//           ^^^^^^ 
//           This is null, causing: "Cannot read properties of null"
```

### Why pnpm Handles This Better

pnpm uses a **completely different approach**:
- It stores all packages in a **global content-addressable store** (like Git objects)
- It creates **hard links** (not symbolic links) from the store to your `node_modules`
- It uses a **strict structure** where each package only accesses its declared dependencies
- This approach is inherently less prone to edge cases like the one npm encountered

Does this clarify things? The key takeaway is that npm tried to optimize your installation by sharing packages, but hit a bug in its optimization logic, while pnpm's different architecture avoided the problem entirely.

</details>
