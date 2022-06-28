FROM node:lts-alpine

RUN apk add --no-cache

RUN npm install -g @nestjs/cli

RUN npm install prisma -D

USER node

WORKDIR /home/node/app
