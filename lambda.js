// AWS Lambda 환경에서 실행될 때는 핸들러로 동작
// 로컬 환경에서 실행될 때는 서버로 동작
const serverlessExpress = require('@vendia/serverless-express');
const sourceMapSupport = require('source-map-support');
const init = require('./app');

// 소스맵 지원 활성화
sourceMapSupport.install();

// Lambda 핸들러 함수
let serverlessExpressInstance;

async function setup() {
  const app = await init();
  return serverlessExpress({ app });
}

// Lambda 핸들러
exports.handler = async (event, context) => {
  if (!serverlessExpressInstance) {
    serverlessExpressInstance = await setup();
  }
  return serverlessExpressInstance(event, context);
};

// 직접 실행될 때는 서버 시작
if (require.main === module) {
  (async () => {
    try {
      const app = await init();
      const port = process.env.PORT || 3000;
      app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
      });
    } catch (err) {
      console.error('애플리케이션 시작 중 오류 발생:', err);
      process.exit(1);
    }
  })();
}
