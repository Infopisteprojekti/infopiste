FROM node:20-alpine AS build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

# Without this, the frontend breaks due to `mkdir() "/var/cache/nginx/client_temp" failed (13: Permission denied)`. 
# Therefore, write permissions are needed for /var/cache/nginx.
RUN mkdir -p /var/cache/nginx && chown -R 1000:1000 /var/cache/nginx

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80
