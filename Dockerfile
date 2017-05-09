FROM node:7.10-alpine

WORKDIR /srv
COPY . /srv
RUN yarn install

CMD [ "node","index.js" ]
