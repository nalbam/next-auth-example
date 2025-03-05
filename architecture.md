# Next-Auth-Example 애플리케이션 아키텍처

## 1. 애플리케이션 개요

이 애플리케이션은 Next.js와 NextAuth.js를 사용한 인증 예제 애플리케이션입니다. Express 서버를 통해 Next.js 애플리케이션을 제공하며, 다양한 인증 방식과 보호된 라우트 예제를 포함하고 있습니다. 이 프로젝트는 Next.js의 App Router를 사용하여 구현되었으며, 서버 컴포넌트와 클라이언트 컴포넌트를 모두 활용합니다.

## 2. 프로젝트 구조

```
next-auth-example/
├── app/                    # Next.js 13+ App Router 구조
│   ├── api/                # API 라우트
│   │   └── protected/      # 보호된 API 라우트
│   ├── auth/               # 인증 관련 라우트
│   │   └── [...nextauth]/  # NextAuth.js 동적 라우트
│   ├── client-example/     # 클라이언트 컴포넌트 예제
│   ├── server-example/     # 서버 컴포넌트 예제
│   ├── middleware-example/ # 미들웨어 보호 예제
│   ├── policy/             # 정책 페이지
│   ├── [...proxy]/         # 프록시 라우트
│   ├── layout.tsx          # 레이아웃 컴포넌트
│   ├── page.tsx            # 메인 페이지
│   ├── globals.css         # 전역 스타일
│   └── favicon.ico         # 파비콘
├── components/             # 재사용 가능한 컴포넌트
│   ├── ui/                 # UI 컴포넌트 (버튼, 아바타, 드롭다운 등)
│   ├── auth-components.tsx # 인증 관련 컴포넌트 (로그인/로그아웃)
│   ├── user-button.tsx     # 사용자 프로필 버튼
│   ├── header.tsx          # 헤더 컴포넌트
│   ├── footer.tsx          # 푸터 컴포넌트
│   ├── layout.tsx          # 레이아웃 컴포넌트
│   ├── main-nav.tsx        # 메인 네비게이션
│   ├── session-data.tsx    # 세션 데이터 표시
│   └── client-example.tsx  # 클라이언트 예제 컴포넌트
├── lib/                    # 유틸리티 함수
│   └── utils.ts            # 유틸리티 함수
├── public/                 # 정적 파일
│   └── logo.png            # 로고 이미지
├── app.js                  # Express 서버 설정
├── app-local.js            # 로컬 개발 서버 실행
├── auth.ts                 # NextAuth 설정
├── middleware.ts           # Next.js 미들웨어
├── index.js                # Serverless 진입점
├── next.config.js          # Next.js 설정
├── tailwind.config.js      # Tailwind CSS 설정
├── postcss.config.js       # PostCSS 설정
├── tsconfig.json           # TypeScript 설정
├── Dockerfile              # Docker 빌드 설정
├── docker-compose.yml      # Docker Compose 설정
├── serverless.yml          # Serverless 배포 설정
└── .env.local.example      # 환경 변수 예제
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
const path = require('path');

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

### Serverless 진입점 (index.js)

AWS Lambda와 같은 서버리스 환경에서 애플리케이션을 실행하기 위한 진입점입니다:

```javascript
// index.js
require('source-map-support/register');

const serverlessExpress = require('@vendia/serverless-express');
const app = require('./app');

let serverlessExpressInstance;

async function setup(event, context) {
  serverlessExpressInstance = serverlessExpress({ app });
  return serverlessExpressInstance(event, context);
}

function handler(event, context) {
  if (serverlessExpressInstance) return serverlessExpressInstance(event, context);

  return setup(event, context);
}

exports.handle = handler;
```

## 8. 배포 방법

### 로컬 개발 환경

```bash
# 의존성 설치
pnpm install

# 환경 변수 설정
cp .env.local.example .env.local
# .env.local 파일 편집하여 필요한 환경 변수 설정

# 로컬 개발 서버 실행
pnpm dev
# 또는
node app-local.js
```

### Docker 배포

Dockerfile은 다단계 빌드를 사용하여 최적화된 이미지를 생성합니다:

1. 의존성 설치 단계
2. 소스 코드 빌드 단계
3. 최종 실행 이미지 생성 단계

#### 일반 Docker 배포

```bash
# Docker 이미지 빌드
docker build -t next-auth-example .

# Docker 컨테이너 실행
docker run -p 3000:3000 next-auth-example

# Docker Compose로 실행
docker-compose up
```

#### AWS Lambda 배포용 Docker 이미지

AWS Lambda에서 실행하기 위한 Dockerfile은 AWS Lambda 컨테이너 이미지 요구사항을 충족하도록 구성되어 있습니다:

1. 기본 이미지로 `public.ecr.aws/lambda/nodejs:20` 사용
2. Lambda 함수 핸들러(`index.handle`)를 실행할 수 있도록 설정
3. 필요한 의존성(`express`, `@vendia/serverless-express`, `source-map-support`)만 설치
4. 빌드된 Next.js 애플리케이션과 Lambda 핸들러 파일 복사

```bash
# AWS Lambda 배포용 Docker 이미지 빌드
docker build -t next-auth-example-lambda .

# ECR 리포지토리에 이미지 푸시
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin 968005369378.dkr.ecr.ap-northeast-2.amazonaws.com
docker tag next-auth-example-lambda 968005369378.dkr.ecr.ap-northeast-2.amazonaws.com/nalbam/next-auth-example:latest
docker push 968005369378.dkr.ecr.ap-northeast-2.amazonaws.com/nalbam/next-auth-example:latest
```

#### Docker Compose 설정 (docker-compose.yml)

```yaml
services:
  authjs-docker-test:
    build: .
    environment:
      - TEST_KEYCLOAK_USERNAME
      - TEST_KEYCLOAK_PASSWORD
      - AUTH_KEYCLOAK_ID
      - AUTH_KEYCLOAK_SECRET
      - AUTH_KEYCLOAK_ISSUER
      - AUTH_SECRET="MohY0/2zSQw/psWEnejC2ka3Al0oifvY4YjOkUaFfnI="
      - AUTH_URL=http://localhost:3000/auth
    ports:
      - "3000:3000"
```

### Serverless 배포

serverless.yml 파일을 사용하여 AWS Lambda에 Docker 이미지로 배포할 수 있습니다:

```yaml
# serverless.yml
app: next-auth-example
service: next-auth-example

provider:
  name: aws
  region: 'ap-northeast-2'
  stage: 'dev'
  timeout: 25
  memorySize: 2048
  environment:
    NODE_ENV: dev
    # .env 파일의 내용을 모두 입력해줍니다.
  ecr:
    images:
      app:
        uri: [ECR_REPOSITORY_URI]:[TAG]
  architecture: x86_64
  iam:
    role:
      statements:
        - Effect: Allow
          Action:
            - ecr:GetDownloadUrlForLayer
            - ecr:BatchGetImage
            - ecr:BatchCheckLayerAvailability
          Resource: "*"

functions:
  app:
    image:
      name: app
    events:
      - httpApi: '*'

plugins:
  - serverless-dotenv-plugin
```

배포 명령어:

```bash
# 의존성 설치
pnpm i express
pnpm i @vendia/serverless-express source-map-support
pnpm add -D serverless-dotenv-plugin

# Docker 이미지 빌드 및 ECR 푸시
docker build -t next-auth-example-lambda .
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin [AWS_ACCOUNT_ID].dkr.ecr.ap-northeast-2.amazonaws.com
docker tag next-auth-example-lambda [AWS_ACCOUNT_ID].dkr.ecr.ap-northeast-2.amazonaws.com/nalbam/next-auth-example:[TAG]
docker push [AWS_ACCOUNT_ID].dkr.ecr.ap-northeast-2.amazonaws.com/nalbam/next-auth-example:[TAG]

# serverless.yml 파일에서 ECR 이미지 URI 업데이트 후 배포
npx serverless deploy --region ap-northeast-2 --stage dev
```

Docker 이미지를 사용하는 AWS Lambda 배포의 장점:

1. 로컬 개발 환경과 배포 환경의 일관성 유지
2. 의존성 관리 간소화
3. 배포 패키지 크기 제한 우회 (Lambda 직접 배포 시 50MB 제한)
4. 복잡한 런타임 환경 지원
5. 컨테이너 기반 배포로 인한 확장성 향상
6. AWS Lambda 환경에 최적화된 설정 가능

## 9. 환경 변수 설정

애플리케이션은 다음과 같은 환경 변수를 사용합니다:

```
# 필수 환경 변수
AUTH_SECRET=           # 인증 암호화 키 (npx auth secret 또는 openssl rand -hex 32로 생성)

# OAuth 제공자 설정
AUTH_FACEBOOK_ID=      # Facebook OAuth 클라이언트 ID
AUTH_FACEBOOK_SECRET=  # Facebook OAuth 클라이언트 시크릿

AUTH_GITHUB_ID=        # GitHub OAuth 클라이언트 ID
AUTH_GITHUB_SECRET=    # GitHub OAuth 클라이언트 시크릿

AUTH_GOOGLE_ID=        # Google OAuth 클라이언트 ID
AUTH_GOOGLE_SECRET=    # Google OAuth 클라이언트 시크릿

# 선택적 환경 변수
AUTH_TRUST_HOST=1      # 프록시 뒤에서 실행할 때 호스트 신뢰 설정
AUTH_DEBUG=true        # 디버그 모드 활성화
```

## 10. 주요 문제 해결

### Docker 빌드 문제

Docker 빌드 중 다음과 같은 오류가 발생할 경우:
```
ERROR: failed to solve: process "/bin/sh -c corepack enable pnpm && pnpm i --frozen-lockfile" did not complete successfully
```

Dockerfile에서 corepack 대신 npm을 통해 pnpm을 직접 설치하도록 변경했습니다:
```dockerfile
# 변경 전
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# 변경 후
RUN npm install -g pnpm && pnpm i --frozen-lockfile
```

### npm 설치 오류

npm을 사용하여 패키지를 설치할 때 "Cannot read properties of null (reading 'matches')" 오류가 발생할 경우:

1. npm 캐시를 정리해보세요:
   ```bash
   npm cache clean --force
   ```

2. 그래도 문제가 해결되지 않으면 pnpm을 사용하세요:
   ```bash
   pnpm add -D [패키지명]
   ```

## 11. 향후 개선 사항

- 추가 인증 제공자 통합 (Twitter, Apple, Microsoft 등)
- 사용자 역할 기반 접근 제어 (RBAC) 구현
- 다국어 지원 추가
- 테스트 자동화 (Jest, Playwright)
- 성능 최적화 및 번들 크기 감소
- 보안 강화 (CSRF 보호, 속도 제한 등)
- 사용자 프로필 관리 기능 추가
- 모니터링 및 로깅 시스템 강화
