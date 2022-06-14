FROM node:16-alpine as base

WORKDIR /usr/src/app

ENV HUSKY=0 \
    CI=true \
    LOG_LEVEL=info \
    DISCORD_TOKEN="" \
    REDIS_URL="" \
    FIREBASE_PROJECT_ID="" \
    FIREBASE_CLIENT_EMAIL="" \
    FIREBASE_PRIVATE_KEY="" \
    TWITCH_CLIENT_ID="" \
    TWITCH_CLIENT_SECRET="" \
    TWITCH_SUBSCRIPTION_SECRET="" \
    GIPHY_API_KEY=""

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

ENV NODE_ENV="production" \
    NODE_OPTIONS="--enable-source-maps"

WORKDIR /usr/src/app

COPY --chown=node:node --from=builder /usr/src/app/build build
COPY --chown=node:node --from=builder /usr/src/app/node_modules node_modules

USER node

CMD ["node", "build/src/bot.js"]
