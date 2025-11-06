FROM node:24-alpine AS build-stage

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginxinc/nginx-unprivileged:alpine

COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY --chown=nginx:nginx nginx/templates/ /etc/nginx/templates

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
