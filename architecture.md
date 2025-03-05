# Next-Auth-Example 애플리케이션 아키텍처

## 1. 애플리케이션 개요

이 애플리케이션은 Next.js와 NextAuth.js를 사용한 인증 예제 애플리케이션입니다. Express 서버를 통해 Next.js 애플리케이션을 제공하며, 다양한 인증 방식과 보호된 라우트 예제를 포함하고 있습니다.

## 2. 프로젝트 구조

```
next-auth-example/
├── app/                    # Next.js 13+ App Router 구조
│   ├── api/                # API 라우트
│   │   └── protected/      # 보호된 API 라우트
│   ├── auth/               # 인증 관련 라우트
│   ├── [...]               # 기타 페이지 컴포넌트
│   ├── layout.tsx          # 레이아웃 컴포넌트
│   └── page.tsx            # 메인 페이지
├── components/             # 재사용 가능한 컴포넌트
│   ├── ui/                 # UI 컴포넌트
│   └── [...]               # 기타 컴포넌트
├── lib/                    # 유틸리티 함수
├── public/                 # 정적 파일
├── app.js                  # Express 서버 설정
├── app-local.js            # 로컬 개발 서버 실행
├── auth.ts                 # NextAuth 설정
└── [...]                   # 기타 설정 파일
```

## 3. 서버 설정

### Express 서버 (app.js)

Express 서버는 Next.js 애플리케이션을 제공하는 역할을 합니다. 서버 초기화 과정은 다음과 같습니다:

1. Express 애플리케이션 생성
2. Next.js 애플리케이션 초기화 (`nextApp.prepare()`)
3. 모든 요청을 Next.js 핸들러로 라우팅
4. 초기화된 애플리케이션 내보내기

```javascript
// app.js
const express = require('express');
const next = require('next');

const dev = true;
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
```

### 로컬 개발 서버 (app-local.js)

로컬 개발 환경에서 애플리케이션을 실행하기 위한 스크립트입니다:

```javascript
// app-local.js
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
```

## 4. 인증 설정 (auth.ts)

NextAuth.js를 사용하여 인증을 구현합니다. 다양한 인증 제공자(OAuth, 이메일, 자격 증명 등)를 설정할 수 있습니다.

## 5. 배포 방법

### 로컬 개발 환경

```bash
# 로컬 개발 서버 실행
node app-local.js
```

### Docker 배포

```bash
# Docker 이미지 빌드
docker build -t next-auth-example .

# Docker 컨테이너 실행
docker run -p 3000:3000 next-auth-example
```

### Serverless 배포

serverless.yml 파일을 사용하여 서버리스 환경에 배포할 수 있습니다.

```bash
# Serverless 플러그인 설치
npm i -g serverless
npm i -g serverless-domain-manager

# 의존성 설치
pnpm i express
pnpm i @vendia/serverless-express source-map-support

# Serverless 플러그인 설치
sls plugin install -n serverless-domain-manager
sls plugin install -n serverless-dotenv-plugin

# 로컬 개발 서버 실행
node app-local.js

# Serverless 배포
npx serverless deploy --region ap-northeast-2 --stage dev
```

## 6. 주요 문제 해결

## 7. 향후 개선 사항

- 환경 변수를 통한 개발/프로덕션 모드 설정
- 로깅 시스템 강화
- 테스트 자동화
- 성능 최적화
