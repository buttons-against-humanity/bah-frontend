# builder image
FROM node:12 AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --no-optional

COPY . .

ENV GENERATE_SOURCEMAP=false

RUN npm run build

# production image
FROM authkeys/nginx-spa:0.1.0

WORKDIR /app

COPY --from=builder /usr/src/app/build .

# Metadata
LABEL name="bah-frontend" \
        description="Buttons Against Humanity Frontend" \
        org.opencontainers.image.vendor="ButtonsAgainstHumanity" \
        org.opencontainers.image.url="https://buttonsagainsthumanity.com/" \
        org.opencontainers.image.source="https://github.com/buttons-against-humanity/bah-frontend" \
        org.opencontainers.image.title="bah-frontend" \
        org.opencontainers.image.description="Buttons Against Humanity Frontend" \
        org.opencontainers.image.version="0.9.0-beta.0" \
        org.opencontainers.image.documentation="https://github.com/buttons-against-humanity/bah-frontend" \
        org.opencontainers.image.licenses='Apache-2.0'
