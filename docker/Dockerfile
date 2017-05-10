FROM alpine:latest

RUN apk -U add openssl

ENV VERSION 0.7.3
ENV DOWNLOAD_URL https://github.com/jwilder/docker-gen/releases/download/$VERSION/docker-gen-alpine-linux-amd64-$VERSION.tar.gz
ENV DOCKER_HOST unix:///tmp/docker.sock

RUN wget -qO- $DOWNLOAD_URL | tar xvz -C /usr/local/bin

ADD https://raw.githubusercontent.com/jwilder/nginx-proxy/master/nginx.tmpl /etc/docker-gen/templates/nginx.tmpl

ENTRYPOINT ["/usr/local/bin/docker-gen"]