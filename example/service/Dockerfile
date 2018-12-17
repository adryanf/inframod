FROM nest-service/infrastructure

# Install pm2
RUN yarn global add pm2

RUN mkdir /app

WORKDIR /app

COPY ecosystem.config.js ./

# Copy package*.json and yarn.lock
COPY package*.json yarn.lock ./

# Install production dependencies
RUN yarn install

# Copy src
COPY src ./src

COPY tsconfig.json ./

RUN yarn run build:prod

RUN rm -rf src

WORKDIR /

RUN rm -rf infrastructure

EXPOSE 3000

WORKDIR /app

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]