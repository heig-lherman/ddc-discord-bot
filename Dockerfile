FROM node:16-alpine

WORKDIR /app

ENV DISCORD_TOKEN "" \
    REDIS_URL "" \
    FIREBASE_PROJECT_ID "" \
    FIREBASE_CLIENT_EMAIL "" \
    FIREBASE_PRIVATE_KEY ""

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci

ENV NODE_ENV=production

# Bundle app source
COPY data ./data
COPY src ./src
COPY tsconfig*.json ./

RUN npm run build

CMD ["node", "build/src/bot.js"]
