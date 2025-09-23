FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --include=dev

COPY . .

EXPOSE 1234

CMD ["npm", "run", "dev"]
