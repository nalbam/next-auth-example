// AWS Lambda 환경에서 실행될 때는 핸들러로 동작
// 로컬 환경에서 실행될 때는 서버로 동작
const serverlessExpress = require('@vendia/serverless-express');
const sourceMapSupport = require('source-map-support');
const express = require('express');

// 소스맵 지원 활성화
sourceMapSupport.install();

// Lambda 핸들러 함수
let serverlessExpressInstance;
let nextAppInitialized = false;
let nextApp;
let nextHandler;

// 초기 Express 앱 생성 (Next.js 없이)
const app = express();

// 상태 확인 엔드포인트 추가
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Next.js 초기화 함수
async function initializeNextApp() {
  if (!nextAppInitialized) {
    console.log('Next.js 애플리케이션 초기화 시작...');
    const next = require('next');
    const dev = process.env.NODE_ENV !== 'production';
    nextApp = next({ dev });
    nextHandler = nextApp.getRequestHandler();
    await nextApp.prepare();
    nextAppInitialized = true;
    console.log('Next.js 애플리케이션 초기화 완료');
  }
  return { nextApp, nextHandler };
}

// 지연 로딩을 위한 미들웨어
app.use(async (req, res, next) => {
  try {
    // 상태 확인 요청은 Next.js 초기화 없이 처리
    if (req.path === '/health') {
      return next();
    }

    // Next.js가 초기화되지 않았다면 초기화
    if (!nextAppInitialized) {
      const { nextHandler } = await initializeNextApp();
      return nextHandler(req, res);
    }

    // 이미 초기화된 경우 Next.js 핸들러 사용
    return nextHandler(req, res);
  } catch (error) {
    console.error('요청 처리 중 오류 발생:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

async function setup() {
  return serverlessExpress({ app });
}

// Lambda 핸들러
exports.handler = async (event, context) => {
  // 상태 확인 요청인지 확인
  const isHealthCheck = event.path === '/health' ||
                        (event.requestContext && event.requestContext.http &&
                         event.requestContext.http.path === '/health');

  // 상태 확인이 아닌 첫 요청에서는 Next.js 초기화 시작
  if (!isHealthCheck && !nextAppInitialized) {
    // 비동기로 Next.js 초기화 시작 (완료를 기다리지 않음)
    initializeNextApp().catch(err => console.error('Next.js 초기화 오류:', err));
  }

  if (!serverlessExpressInstance) {
    serverlessExpressInstance = await setup();
  }

  return serverlessExpressInstance(event, context);
};

// 직접 실행될 때는 서버 시작
if (require.main === module) {
  (async () => {
    try {
      // 서버 시작
      const port = process.env.PORT || 3000;
      app.listen(port, () => {
        console.log(`서버가 포트 ${port}에서 실행 중입니다.`);

        // 백그라운드에서 Next.js 초기화
        initializeNextApp().then(() => {
          console.log('Next.js 애플리케이션이 초기화되었습니다.');
        }).catch(err => {
          console.error('Next.js 초기화 중 오류 발생:', err);
        });
      });
    } catch (err) {
      console.error('애플리케이션 시작 중 오류 발생:', err);
      process.exit(1);
    }
  })();
}
