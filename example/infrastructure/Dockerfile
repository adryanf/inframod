FROM node:alpine

RUN mkdir infrastructure

WORKDIR infrastructure

COPY . .

# Install yarn
RUN npm install --global yarn

# Install dependencies
RUN yarn install

RUN npm run build