FROM node:8.0-alpine

ENV DOCKERIZE_VERSION v0.4.0
RUN apk add --no-cache --virtual .build-deps curl \
    && curl -fSL  -o dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

WORKDIR /srv
COPY . /srv
RUN yarn install && yarn build && rm -rf /srv/src

CMD dockerize -wait tcp://postgres:5432 -timeout 10s && yarn start
