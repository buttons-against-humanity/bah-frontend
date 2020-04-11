# builder image
FROM node:12 AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --no-optional

COPY . .

RUN npm run build

# production image
FROM node:12-alpine

EXPOSE 8080

ENV NODE_ENV=production

WORKDIR /app

RUN npm i -g serve

COPY --from=builder /usr/src/app/build .

CMD [ "serve", "-s", "-l", "8080" ]
