FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY .docker/entrypoint.sh /etc/entrypoint.sh

ENTRYPOINT [ "sh", "/etc/entrypoint.sh" ]