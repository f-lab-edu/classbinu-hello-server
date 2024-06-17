
## Docker
```bash
# 멀티 아키텍처 빌더 활성화
docker buildx create --name mybuilder --use

# 멀티 아키텍처 빌드
docker buildx build --platform linux/amd64,linux/arm64 -t classbinu/hello:0.2 --push .
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```