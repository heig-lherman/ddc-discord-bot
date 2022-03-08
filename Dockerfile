FROM node:16-alpine

WORKDIR /app

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

ENV DISCORD_TOKEN ""
ENV REDIS_URL ""
ENV FIREBASE_PROJECT_ID ""
ENV FIREBASE_CLIENT_EMAIL ""
ENV FIREBASE_PRIVATE_KEY ""

CMD ["node", "build/src/bot.js"]
