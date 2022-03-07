FROM node:16-alpine
ENV NODE_ENV=production

WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm i -g typescript
RUN npm ci --only=production

# Bundle app source
COPY . .
RUN npm run build

ENV DISCORD_TOKEN ""
ENV REDIS_URL ""

CMD ["node", "build/src/bot.js"]
