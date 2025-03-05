// app.js에서 초기화 함수를 가져옴
const init = require('./app');

// 애플리케이션 시작
const startApp = async () => {
  try {
    // 초기화 함수 호출하여 앱 인스턴스 가져오기
    const app = await init();

    // 서버 시작
    app.listen(3000, () => console.log('http://localhost:3000'));
  } catch (err) {
    console.error('애플리케이션 시작 중 오류 발생:', err);
    process.exit(1);
  }
};

startApp();
