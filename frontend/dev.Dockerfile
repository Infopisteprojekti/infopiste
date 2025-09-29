FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --include=dev

COPY . .

COPY .env .env

CMD ["npm", "run", "dev"] 
