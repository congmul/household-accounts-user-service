ARG NODE_VERSION=20.15.0

FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV production

WORKDIR /app

COPY . /app

RUN npm install -g pnpm
RUN pnpm install && pnpm run build

CMD node dist/app.js