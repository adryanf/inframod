FROM node:alpine

RUN mkdir common-modules

WORKDIR common-modules

COPY . .

# Install yarn
RUN npm install --global yarn

# Install dependencies
RUN yarn install

RUN npm run build