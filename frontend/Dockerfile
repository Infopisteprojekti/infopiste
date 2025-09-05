FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /var/cache/nginx /var/run /etc/nginx/conf.d \
    && chgrp -R 0 /var/cache/nginx /var/run /etc/nginx/conf.d /usr/share/nginx/html \
    && chmod -R g=u /var/cache/nginx /var/run /etc/nginx/conf.d /usr/share/nginx/html

EXPOSE 8080
