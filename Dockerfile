FROM node:20.11.1-alpine

WORKDIR /usr/src/app

# . 또는 ./ 은 WORKDIR을 의미
COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]

# 멀티 아키텍처 빌더 활성화
#docker buildx create --name mybuilder --use

# 멀티 아키텍처 빌드
# docker buildx build --platform linux/amd64,linux/arm64 -t classbinu/hello:0.2 --push .


# 이미지 빌드
# docker build -t hello .

# 컨테이너 실행
# docker run -p 3000:3000 hello