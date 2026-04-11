# STOP - Smart Travel Over Points (frontend)

## Overview

This is the frontend code for STOP, a travel planning app that helps users find the best stops along their route.

### Rules of work in this project:
- make your changes on separate branches and create pull requests to merge them with `main`
- summarize your changes in the pull request description and link to any relevant issues or documentation
- write clear commit messages that describe the changes you've made
- use `git rebase` to keep your commit history clean and organized

## Getting started

This project utilizes bun as the package manager. If you don't have bun installed, please refer to [bun.sh](https://bun.sh/).

```sh
# install the dependencies
bun install
```

To run the development server:

```sh
bun run dev
```

## Building the project
To build the project for production:
```sh
# build the project
bun run build

# preview the production build
bun run preview
```

> To deploy this app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
> For example, to deploy on Vercel, you can install the `@sveltejs/adapter-vercel` package and update your `svelte.config.js` file accordingly.
> By default, this project is configured to use the `@sveltejs/adapter-auto` adapter, which automatically selects the appropriate adapter based on the environment.
