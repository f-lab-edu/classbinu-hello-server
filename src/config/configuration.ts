export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  db: {
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) || 5432,
  },
  swaggerApi: {
    title: '오늘의 일기 API',
    description: '오늘의 일기 API Description',
    version: '0.1',
    apiRoot: process.env.SWAGGER_API_ROOT,
  },
});
