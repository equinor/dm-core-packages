# This image is built from the repository root so that the npm workspace
# `package-lock.json` is available for a reproducible `npm ci` install.
# Build it with:  docker build -f example/Dockerfile .
FROM node:24-bullseye-slim AS base

ARG AUTH_ENABLED=0
ARG REDIRECT_URI=http://localhost/
# Azure AD requires a scope.
ARG AUTH_SCOPE=""
ARG CLIENT_ID=""
ARG TENANT_ID=""
ENV REACT_APP_AUTH_SCOPE=$AUTH_SCOPE
ENV REACT_APP_AUTH=$AUTH_ENABLED
ENV REACT_APP_AUTH_CLIENT_ID=$CLIENT_ID
ENV REACT_APP_AUTH_TENANT=$TENANT_ID
ENV REACT_APP_TOKEN_ENDPOINT=https://login.microsoftonline.com/${REACT_APP_AUTH_TENANT}/oauth2/v2.0/token
ENV REACT_APP_AUTH_ENDPOINT=https://login.microsoftonline.com/${REACT_APP_AUTH_TENANT}/oauth2/v2.0/authorize
ENV REACT_APP_LOGOUT_ENDPOINT=https://login.microsoftonline.com/${REACT_APP_AUTH_TENANT}/oauth2/logout
ENV REACT_APP_AUTH_REDIRECT_URI=$REDIRECT_URI

WORKDIR /code

# Copy the root manifest, lockfile and every workspace manifest first so the
# dependency install layer is cached independently of source changes.
COPY package.json package-lock.json ./
COPY example/package.json ./example/package.json
COPY packages/dm-core/package.json ./packages/dm-core/package.json
COPY packages/dm-core-plugins/package.json ./packages/dm-core-plugins/package.json
RUN npm ci

COPY . .

FROM base AS development
USER 1000
CMD ["npm", "run", "start:example"]

FROM base AS prod
# Build the local workspace packages the example depends on.
RUN npm run build:packages
RUN mkdir -p /code/example/dist
RUN chown -R 1000:1000 /code
WORKDIR /code/example
USER 1000
EXPOSE 3000
CMD ["/code/example/src/init.sh", "start"]