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
let nextAppInitializing = false;
let nextApp;
let nextHandler;

// 초기 Express 앱 생성 (Next.js 없이)
const app = express();

// 상태 확인 엔드포인트 추가
app.get('/health', (req, res) => {
  const status = {
    status: 'ok',
    nextjs: nextAppInitialized ? 'initialized' : (nextAppInitializing ? 'initializing' : 'not_initialized')
  };
  res.status(200).json(status);
});

// 초기화 중 응답 엔드포인트 추가
app.get('/', (req, res, next) => {
  if (!nextAppInitialized && !req.headers['x-next-init-bypass']) {
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>애플리케이션 초기화 중...</title>
          <meta http-equiv="refresh" content="3;url=/?init=1">
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding-top: 50px; }
            .loader { border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin: 20px auto; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          </style>
        </head>
        <body>
          <h2>애플리케이션 초기화 중...</h2>
          <div class="loader"></div>
          <p>잠시만 기다려주세요. 자동으로 새로고침됩니다.</p>
          <p>초기화 상태: ${nextAppInitializing ? '초기화 진행 중...' : '초기화 대기 중...'}</p>
        </body>
      </html>
    `);
  }
  next();
});

// 정적 파일 처리 (Next.js 초기화 전에도 작동)
app.use('/_next/static', express.static('.next/static', { maxAge: '1y' }));
app.use('/public', express.static('public', { maxAge: '1y' }));

// Next.js 초기화 함수 - 비동기로 실행되며 완료를 기다리지 않음
function startNextInitialization() {
  if (nextAppInitialized || nextAppInitializing) return;

  nextAppInitializing = true;

  // 비동기 즉시 실행 함수
  (async () => {
    try {
      console.log('Next.js 애플리케이션 초기화 시작...');

      // 동적으로 next 모듈 로드
      const next = require('next');
      const dev = process.env.NODE_ENV !== 'production';
      nextApp = next({ dev });
      nextHandler = nextApp.getRequestHandler();

      // Next.js 준비
      await nextApp.prepare();

      nextAppInitialized = true;
      nextAppInitializing = false;
      console.log('Next.js 애플리케이션 초기화 완료');
    } catch (error) {
      console.error('Next.js 초기화 중 오류 발생:', error);
      nextAppInitializing = false;
    }
  })();
}

// 지연 로딩을 위한 미들웨어
app.use(async (req, res, next) => {
  try {
    // 상태 확인 요청은 Next.js 초기화 없이 처리
    if (req.path === '/health') {
      return next();
    }

    // Next.js 초기화 시작 (아직 시작되지 않았다면)
    if (!nextAppInitialized && !nextAppInitializing) {
      startNextInitialization();
    }

    // Next.js가 초기화되었으면 요청 처리
    if (nextAppInitialized && nextHandler) {
      return nextHandler(req, res);
    }

    // 초기화 중이면 대기 페이지 표시 (이미 위에서 처리했으므로 여기서는 통과)
    next();
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
  // 초기화 단계에서는 Next.js 초기화를 시작하지 않음
  // 첫 번째 요청에서 초기화 시작

  if (!serverlessExpressInstance) {
    serverlessExpressInstance = await setup();
  }

  // 요청 헤더에 초기화 우회 플래그 추가
  if (event.headers) {
    event.headers['x-next-init-bypass'] = '1';
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

        // 서버 시작 후 약간의 지연을 두고 Next.js 초기화 시작
        setTimeout(() => {
          startNextInitialization();
        }, 1000);
      });
    } catch (err) {
      console.error('애플리케이션 시작 중 오류 발생:', err);
      process.exit(1);
    }
  })();
}
