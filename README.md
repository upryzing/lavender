# Upryzing's Web App (Lavender)

This repository houses the source code for Lavender, Upryzing's web app, built with Solid.js.

## Development Guide

Before contributing, make yourself familiar with [our contribution guidelines](https://developers.revolt.chat/contrib.html), the [code style guidelines](./GUIDELINES.md), and the [technical documentation for this project](https://upryzing.github.io/lavender/).

Before getting started, you'll want to install:

- Git,
- Node.js (v18+), and
- pnpm (run `corepack enable`).

Then proceed to setup:

```bash
# clone the repository
git clone --recursive https://github.com/upryzing/lavender lavender
cd lavender

# update submodules if you pull new changes
# git submodule init && git submodule update

# install all packages
pnpm i

# build deps:
pnpm build:deps

# ...or build a specific dep (e.g. @upryzing/upryzing.js updates):
# pnpm --filter @upryzing/upryzing.js run build

# run dev server
pnpm dev:web
```

Finally, navigate to http://local.revolt.chat:5173.

### Faster iteration with @upryzing/upryzing.js

To make it easier to work with `uprzying.js`, you may want to temporarily make this change:

```diff
# packages/uprzying.js/package.json
-  "module": "lib/esm/index.js",
+  "module": "src/index.ts",
```

Any edits to the `uprzying.js` codebase will immediately be reflected while developing.

## Deployment Guide

### Build the app

```bash
# install packages
pnpm i

# build dependencies
pnpm build:deps

# build for web
pnpm build:web

# ... when building for production, use this instead of :web
pnpm build:prod
```

You can now deploy the directory `packages/client/dist`.

### Routing Information

The app currently needs the following routes:

- `/login`
- `/pwa`
- `/dev`
- `/settings`
- `/friends`
- `/server`
- `/channel`

This corresponds to [Content.tsx#L33](packages/client/src/index.tsx).
