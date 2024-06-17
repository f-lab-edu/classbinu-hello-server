FROM node:20.11.1-alpine

WORKDIR /usr/src/app

# . 또는 ./ 은 WORKDIR을 의미
COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]