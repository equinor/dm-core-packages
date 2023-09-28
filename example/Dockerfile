FROM node:19-bullseye-slim as base
WORKDIR /code
COPY package.json ./
RUN yarn install  --immutable --immutable-cache

FROM base AS development
COPY ./ ./
CMD ["yarn", "start"]
USER 1000

FROM base AS prod
COPY ./ ./
RUN chown -R 1000:1000 /code
USER 1000
EXPOSE 3000
RUN mkdir -p /code/dist
CMD ["/code/src/init.sh", "start"]
