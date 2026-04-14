ARG BASE_IMAGE="oven/bun:1"
ARG PORT="8080"
ARG PUBLIC_BACKEND_URL=""

FROM ${BASE_IMAGE} AS base
WORKDIR /usr/src/app

ARG PORT
ARG PUBLIC_BACKEND_URL

# Install dependencies
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Build stage
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

ENV NODE_ENV=production
ENV PUBLIC_BACKEND_URL=${PUBLIC_BACKEND_URL}

# Run svelte-kit sync before build
RUN bun run prepare
RUN bun run build

# Production stage
FROM base AS release
COPY --from=install /temp/dev/node_modules node_modules
COPY --from=prerelease /usr/src/app/build build
COPY --from=prerelease /usr/src/app/package.json .

USER bun
EXPOSE ${PORT}/tcp
ENV PORT=${PORT}

CMD ["bun", "run", "start"]
