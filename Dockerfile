# builder image
FROM node:12 AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --no-optional

COPY . .

RUN npm run build

# production image
FROM node:12-alpine

LABEL name="bah-frontend"
LABEL description="Buttons Against Humanity Frontend"
LABEL maintainer="https://github.com/buttons-against-humanity"

EXPOSE 8080

ENV NODE_ENV=production

WORKDIR /app

RUN npm i -g serve

COPY --from=builder /usr/src/app/build .

CMD [ "serve", "-s", "-l", "8080" ]

# Metadata
LABEL org.opencontainers.image.vendor="ButtonsAgainstHumanity" \
        org.opencontainers.image.url="https://buttonsagainsthumanity.com/" \
        org.opencontainers.image.source="https://github.com/buttons-against-humanity/bah-frontend" \
        org.opencontainers.image.title="bah-backend" \
        org.opencontainers.image.description="Buttons Against Humanity Frontend" \
        org.opencontainers.image.version="0.2.1" \
        org.opencontainers.image.documentation="https://github.com/buttons-against-humanity/bah-frontend" \
        org.opencontainers.image.licenses='Apache-2.0'
