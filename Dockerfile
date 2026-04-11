ARG BASE_IMAGE="oven/bun:1"
ARG PORT="8080"

ARG PUBLIC_BACKEND_URL="localhost:3000"

FROM ${BASE_IMAGE} AS base
WORKDIR /usr/src/app

ARG PORT
ARG PUBLIC_BACKEND_URL

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
# FIXME: This should have --production
RUN cd /temp/prod && bun install --frozen-lockfile 

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# build
# FIXME: this should be production, but all dependencies in package.json are set as dev
ENV NODE_ENV=development

ENV PUBLIC_BACKEND_URL=${SERVER_URL}

RUN bun run build

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/package.json .

# run the app
USER bun
EXPOSE ${PORT}/tcp

ENV PORT=${PORT}

CMD [ "bun", "run", "preview", "--host", "0.0.0.0" ]
