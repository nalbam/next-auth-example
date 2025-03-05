const express = require('express');
const next = require('next');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const app = express();

// 서버 초기화 함수
const init = async () => {
  // Next.js 애플리케이션 초기화
  await nextApp.prepare();

  app.all('*', (req, res) => {
    return handle(req, res);
  });

  return app;
};

// 초기화 함수 내보내기
module.exports = init;
