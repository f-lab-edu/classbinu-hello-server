FROM node:20.11.1-alpine

WORKDIR /usr/src/app

# . 또는 ./ 은 WORKDIR을 의미
COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]

# 이미지 빌드
# docker build -t hello .

# 컨테이너 실행
# docker run -p 3000:3000 hello