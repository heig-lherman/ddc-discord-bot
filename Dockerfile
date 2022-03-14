FROM node:16-alpine as base

WORKDIR /usr/src/app

ENV CI=true
ENV LOG_LEVEL=info
ENV DISCORD_TOKEN=""
ENV REDIS_URL=""
ENV FIREBASE_PROJECT_ID=""
ENV FIREBASE_CLIENT_EMAIL=""
ENV FIREBASE_PRIVATE_KEY=""

COPY --chown=node:node package-lock.json .
COPY --chown=node:node package.json .

FROM base as builder

ENV NODE_ENV="development"

COPY --chown=node:node tsconfig.json .
COPY --chown=node:node scripts/ scripts/
COPY --chown=node:node src/ src/

RUN apk add --no-cache python3 make g++
RUN npm ci
RUN npm run build

FROM base AS runner

ENV NODE_ENV="production"
ENV NODE_OPTIONS="--enable-source-maps"

WORKDIR /usr/src/app

COPY --chown=node:node --from=builder /usr/src/app/build build
COPY --chown=node:node --from=builder /usr/src/app/node_modules node_modules

USER node

CMD ["node", "build/src/bot.js"]
