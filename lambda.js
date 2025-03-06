// AWS Lambda 핸들러
const serverlessExpress = require('@vendia/serverless-express');
const sourceMapSupport = require('source-map-support');
const init = require('./app');

// 소스맵 지원 활성화
sourceMapSupport.install();

// Lambda 핸들러 초기화
let serverlessExpressInstance;

async function setup(event, context) {
  const app = await init();
  serverlessExpressInstance = serverlessExpress({ app });
  return serverlessExpressInstance(event, context);
}

// Lambda 핸들러 함수
exports.handler = async (event, context) => {
  if (serverlessExpressInstance) {
    return serverlessExpressInstance(event, context);
  }
  return setup(event, context);
};

// 로컬 개발 환경에서 실행될 경우
if (process.env.NODE_ENV !== 'production') {
  (async () => {
    try {
      const app = await init();
      const port = process.env.PORT || 3000;
      app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
      });
    } catch (err) {
      console.error('Server initialization error:', err);
      process.exit(1);
    }
  })();
}
