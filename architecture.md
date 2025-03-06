# Next-Auth-Example 애플리케이션 아키텍처

## 1. 애플리케이션 개요

이 애플리케이션은 Next.js와 NextAuth.js(Auth.js)를 사용한 인증 예제 애플리케이션입니다. Express 서버를 통해 Next.js 애플리케이션을 제공하며, 다양한 인증 방식과 보호된 라우트 예제를 포함하고 있습니다. 이 프로젝트는 Next.js의 App Router를 사용하여 구현되었으며, 서버 컴포넌트와 클라이언트 컴포넌트를 모두 활용합니다. AWS Lambda와 Docker를 통한 서버리스 배포를 지원합니다.

### 주요 기능

- 다양한 OAuth 제공자를 통한 인증 (GitHub, Google, Facebook, Twitter 등)
- JWT 기반 세션 관리
- 서버 컴포넌트에서의 인증 상태 접근 (`auth()` 함수 사용)
- 클라이언트 컴포넌트에서의 인증 상태 접근 (`useSession()` 훅 사용)
- 미들웨어를 통한 라우트 보호
- API 라우트 보호
- WebAuthn 지원 (실험적 기능)
- Unstorage 어댑터를 통한 세션 저장소 지원 (메모리 또는 Vercel KV)
- Tailwind CSS와 Radix UI를 활용한 모던 UI 컴포넌트

## 2. 프로젝트 구조

```
next-auth-example/
├── app/                    # Next.js 13+ App Router 구조
│   ├── api/                # API 라우트
│   │   └── protected/      # 보호된 API 라우트 (인증 필요)
│   ├── auth/               # 인증 관련 라우트
│   │   └── [...nextauth]/  # NextAuth.js 동적 라우트
│   ├── client-example/     # 클라이언트 컴포넌트 예제
│   ├── server-example/     # 서버 컴포넌트 예제
│   ├── middleware-example/ # 미들웨어 보호 예제
│   ├── policy/             # 정책 페이지
│   ├── api-example/        # API 예제 페이지
│   ├── [...proxy]/         # 프록시 라우트
│   ├── layout.tsx          # 레이아웃 컴포넌트
│   ├── page.tsx            # 메인 페이지
│   ├── globals.css         # 전역 스타일
│   └── favicon.ico         # 파비콘
├── components/             # 재사용 가능한 컴포넌트
│   ├── ui/                 # UI 컴포넌트 (버튼, 아바타, 드롭다운 등)
│   │   ├── avatar.tsx      # 아바타 컴포넌트
│   │   ├── button.tsx      # 버튼 컴포넌트
│   │   ├── dropdown-menu.tsx # 드롭다운 메뉴 컴포넌트
│   │   ├── input.tsx       # 입력 컴포넌트
│   │   └── navigation-menu.tsx # 네비게이션 메뉴 컴포넌트
│   ├── access-denied.tsx   # 접근 거부 컴포넌트
│   ├── auth-components.tsx # 인증 관련 컴포넌트 (로그인/로그아웃)
│   ├── user-button.tsx     # 사용자 프로필 버튼
│   ├── header.tsx          # 헤더 컴포넌트
│   ├── footer.tsx          # 푸터 컴포넌트
│   ├── layout.tsx          # 레이아웃 컴포넌트
│   ├── main-nav.tsx        # 메인 네비게이션
│   ├── session-data.tsx    # 세션 데이터 표시
│   ├── custom-link.tsx     # 커스텀 링크 컴포넌트
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
├── test-docker.sh          # Docker 테스트 스크립트
├── VERSION                 # 버전 정보 파일
└── .env.local.example      # 환경 변수 예제
```

## 3. 이미지 최적화 설정

Next.js의 이미지 최적화 기능을 AWS Lambda 환경에서 사용하기 위해 다음과 같은 설정을 적용했습니다:

### AWS Lambda 및 API Gateway 설정 (serverless.yml)

Lambda 함수와 API Gateway가 이미지를 효율적으로 처리할 수 있도록 다음과 같이 설정했습니다:

```yaml
provider:
  timeout: 30          # 이미지 처리를 위해 타임아웃 증가
  memorySize: 2048     # 이미지 처리를 위한 충분한 메모리
  apiGateway:
    binaryMediaTypes:
      - '*/*'          # 모든 바이너리 미디어(이미지 포함) 처리
  image: [ECR_REPOSITORY_URI]:[TAG]  # Docker 이미지 URI
```

이 설정의 주요 포인트:
1. `memorySize: 3072`: 이미지 처리에 필요한 충분한 메모리 할당 (CPU 성능도 향상)
2. `timeout: 30`: 이미지 처리에 필요한 충분한 시간 제공
3. `binaryMediaTypes: ['*/*']`: 모든 바이너리 미디어 타입 지원

### Next.js 이미지 설정 (next.config.js)

```javascript
module.exports = {
  output: "standalone",
  images: {
    unoptimized: true, // Lambda 환경에서 이미지 최적화 비활성화
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}
```

이 설정의 주요 포인트:
1. `unoptimized: true`: Lambda 환경에서 이미지 최적화를 비활성화하여 서버리스 환경에서의 호환성 확보
2. `remotePatterns`: 모든 HTTPS 도메인의 이미지를 허용하도록 설정
3. `output: "standalone"`: Next.js 애플리케이션을 독립 실행형으로 빌드하여 서버리스 환경에 최적화

### 미들웨어 설정 (middleware.ts)

미들웨어 설정에서 `_next/image` 경로를 제외 목록에서 제거하여 이미지 요청이 정상적으로 처리되도록 수정했습니다:

```typescript
export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
}
```

이 설정은 정적 파일과 API 라우트를 제외한 모든 경로에 미들웨어를 적용합니다. 특히 `_next/image` 경로가 제외 목록에 없어 이미지 요청이 미들웨어를 통과하도록 합니다.

## 4. 서버 설정

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

이 설정의 주요 포인트:
1. `source-map-support/register`: 소스맵 지원을 활성화하여 디버깅 용이성 향상
2. `@vendia/serverless-express`: Express 애플리케이션을 AWS Lambda 핸들러로 변환
3. 싱글톤 패턴을 사용하여 서버리스 인스턴스 재사용 (콜드 스타트 최소화)

## 5. 인증 시스템 (auth.ts)

이 애플리케이션은 NextAuth.js(Auth.js)를 사용하여 인증 시스템을 구현합니다. 주요 설정은 다음과 같습니다:

### 인증 제공자

다음과 같은 OAuth 제공자를 지원합니다:
- Facebook
- GitHub
- Google
- Twitter (환경 변수에 설정됨)

### 스토리지 어댑터

세션 및 사용자 데이터 저장을 위해 Unstorage 어댑터를 사용합니다:
- 프로덕션 환경(Vercel): Vercel KV 스토리지 사용
- 개발 환경: 메모리 스토리지 사용

```typescript
// auth.ts
import NextAuth from "next-auth"
import "next-auth/jwt"

import Facebook from "next-auth/providers/facebook"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { createStorage } from "unstorage"
import memoryDriver from "unstorage/drivers/memory"
import vercelKVDriver from "unstorage/drivers/vercel-kv"
import { UnstorageAdapter } from "@auth/unstorage-adapter"

const storage = createStorage({
  driver: process.env.VERCEL
    ? vercelKVDriver({
        url: process.env.AUTH_KV_REST_API_URL,
        token: process.env.AUTH_KV_REST_API_TOKEN,
        env: false,
      })
    : memoryDriver(),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: !!process.env.AUTH_DEBUG,
  theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  adapter: UnstorageAdapter(storage),
  providers: [
    Facebook,
    GitHub,
    Google,
  ],
  basePath: "/auth",
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname === "/middleware-example") return !!auth
      return true
    },
    jwt({ token, trigger, session, account }) {
      if (trigger === "update") token.name = session.user.name
      if (account?.provider === "keycloak") {
        return { ...token, accessToken: account.access_token }
      }
      return token
    },
    async session({ session, token }) {
      if (token?.accessToken) session.accessToken = token.accessToken

      return session
    },
  },
  experimental: { enableWebAuthn: true },
})
```

### 타입 확장

NextAuth.js의 타입을 확장하여 accessToken을 세션과 JWT에 추가합니다:

```typescript
declare module "next-auth" {
  interface Session {
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
  }
}
```

### 주요 기능

1. **JWT 세션 전략**: 세션 정보를 JWT 토큰에 저장하여 관리합니다.
2. **경로 보호**: 미들웨어를 통해 특정 경로에 대한 접근을 제한합니다.
3. **토큰 커스터마이징**: JWT 토큰에 추가 정보(예: accessToken)를 포함시킵니다.
4. **세션 커스터마이징**: 클라이언트에 전달되는 세션 객체에 추가 정보를 포함시킵니다.
5. **WebAuthn 지원**: 생체 인증 및 하드웨어 키를 통한 인증을 지원합니다(실험적 기능).
6. **세션 업데이트**: 클라이언트에서 세션 정보를 업데이트할 수 있는 기능을 제공합니다.

## 6. 미들웨어 (middleware.ts)

Next.js 미들웨어를 사용하여 라우트 보호 및 인증 상태 확인을 구현합니다:

```typescript
// middleware.ts
export { auth as middleware } from "auth"

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
}
```

미들웨어는 정적 파일을 제외한 모든 경로에 적용되며, auth.ts에서 정의된 authorized 콜백을 통해 접근 제어를 수행합니다. 특히 `/middleware-example` 경로는 인증된 사용자만 접근할 수 있도록 설정되어 있습니다.

## 7. 배포 방법

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

```dockerfile
# syntax=docker/dockerfile:1
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml* ./
# 직접 pnpm 설치 후 의존성 설치
RUN npm install -g pnpm && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm install -g pnpm && pnpm build

# AWS Lambda 실행을 위한 이미지, 필요한 파일만 복사
FROM public.ecr.aws/lambda/nodejs:20 AS runner
WORKDIR ${LAMBDA_TASK_ROOT}

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 필요한 의존성 설치
RUN npm install express @vendia/serverless-express source-map-support

# 빌드된 Next.js 애플리케이션 복사
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Lambda 핸들러 파일 복사
COPY app.js ./
COPY index.js ./

# Lambda 함수 핸들러 설정
CMD ["index.handle"]
```

#### 일반 Docker 배포

```bash
# Docker 이미지 빌드
docker build -t next-auth-example .

# Docker 컨테이너 실행
docker run -p 3000:3000 next-auth-example

# Docker Compose로 실행
docker-compose up
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
# org: nalbam
app: next-auth-example
service: next-auth-example

provider:
  name: aws
  region: 'ap-northeast-2'
  stage: 'dev'
  # stackName: ${self:service}-${self:provider.stage}
  # apiName: ${self:service}-${self:provider.stage}
  timeout: 25
  memorySize: 2048
  apiGateway:
    binaryMediaTypes:
      - '*/*'
  # tracing:
  #   apiGateway: true
  #   lambda: true
  environment:
    NODE_ENV: dev
  ecr:
    images:
      app:
        uri: 968005369378.dkr.ecr.ap-northeast-2.amazonaws.com/nalbam/next-auth-example:latest
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
      # command:
      #   - index.handle
    # events:
    #   - httpApi: '*'
    events:
      - http:
          cors: true
          path: '/'
          method: any
      - http:
          cors: true
          path: '{proxy+}'
          method: any

plugins:
  - serverless-dotenv-plugin
  # - serverless-domain-manager
  - serverless-plugin-warmup

custom:
  # customDomain:
  #   domainName: next-auth.nalbam.com
  #   basePath: ''
  #   stage: ${self:provider.stage}
  #   createRoute53Record: true
  #   certificateName: arn:aws:acm:us-east-1:968005369378:certificate/b01e68e2-aaa9-410e-97fa-8f1ed4c18c7d
  #   securityPolicy: tls_1_2

  warmup:
    enabled: true
    events:
      - schedule: rate(5 minutes)
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

# ECR 리포지토리에 이미지 푸시 (Docker V2 Schema 2 형식으로 푸시)
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin 968005369378.dkr.ecr.ap-northeast-2.amazonaws.com
docker tag next-auth-example-lambda 968005369378.dkr.ecr.ap-northeast-2.amazonaws.com/nalbam/next-auth-example:latest
docker push 968005369378.dkr.ecr.ap-northeast-2.amazonaws.com/nalbam/next-auth-example:latest
```

### GitHub Actions 배포 파이프라인

GitHub Actions를 사용하여 자동화된 배포 파이프라인을 구성했습니다:

```yaml
# .github/workflows/push.yml
name: build

on:
  push:
    branches:
      - main
      - master

env:
  AWS_REGION: ap-northeast-2
  AWS_ROLE_ARN: "arn:aws:iam::968005369378:role/next-auth-example"

  PLATFORM: linux/amd64 # ,linux/arm64

  IMAGE_URI: "968005369378.dkr.ecr.ap-northeast-2.amazonaws.com/nalbam/next-auth-example"

  AUTH_SECRET: ${{ secrets.AUTH_SECRET }}
  AUTH_GITHUB_ID: ${{ secrets.AUTH_GITHUB_ID }}
  AUTH_GITHUB_SECRET: ${{ secrets.AUTH_GITHUB_SECRET }}
  AUTH_GOOGLE_ID: ${{ secrets.AUTH_GOOGLE_ID }}
  AUTH_GOOGLE_SECRET: ${{ secrets.AUTH_GOOGLE_SECRET }}

# Permission can be added at job level or workflow level
permissions:
  id-token: write   # This is required for requesting the JWT
  contents: write   # This is required for actions/checkout

jobs:
  build:
    runs-on: ubuntu-24.04

    steps:
      - name: Checkout 🛎️
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Bump Version 🏷️
        id: bump
        uses: opspresso/action-builder@master
        with:
          args: --version

      - name: Release Version 🚀
        uses: opspresso/action-builder@master
        with:
          args: --release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          TAG_NAME: ${{ steps.bump.outputs.version }}

      - name: Set up QEMU 🐳
        uses: docker/setup-qemu-action@v3

      - name: Set up Docker Buildx 🐳
        id: buildx
        uses: docker/setup-buildx-action@v3

      - name: Configure AWS Credentials 🔑
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ env.AWS_ROLE_ARN }}
          role-session-name: github-actions-ci-bot
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR

## 8. 자동화된 배포 파이프라인

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

# ECR 리포지토리에 이미지 푸시 (Docker V2 Schema 2 형식으로 푸시)
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin 968005369378.dkr.ecr.ap-northeast-2.amazonaws.com
docker tag next-auth-example-lambda 968005369378.dkr.ecr.ap-northeast-2.amazonaws.com/nalbam/next-auth-example:latest
docker push 968005369378.dkr.ecr.ap-northeast-2.amazonaws.com/nalbam/next-auth-example:latest
```

#### Docker V2 Schema 2 형식 사용

AWS Lambda는 Docker V2 Schema 2 형식의 이미지를 요구합니다. GitHub Actions에서 이미지를 빌드하고 푸시할 때 다음과 같은 설정을 사용하여 Docker V2 Schema 2 형식을 강제 적용합니다:

```yaml
- name: Build and push
  uses: docker/build-push-action@v6
  with:
    context: .
    platforms: linux/amd64
    tags: "your-ecr-repo:latest"
    outputs: type=image,push=true
    provenance: false  # Docker V2 Schema 2 형식으로 강제 적용 (OCI 형식 비활성화)
```

이 설정의 주요 포인트:
1. `outputs: type=image,push=true`: 이미지를 빌드하고 푸시하는 방식 지정
2. `provenance: false`: OCI 형식 대신 Docker V2 Schema 2 형식 사용 강제 적용

Docker V2 Schema 2 형식을 사용하는 이유:
- AWS Lambda가 OCI 형식이 아닌 Docker V2 Schema 2 형식만 지원
- 호환성 및 안정성 향상
- Lambda 함수 배포 시 오류 방지

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

## 9. 환경 변수 구성

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

## 10. 문제 해결 가이드

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

### AWS Lambda에서 Docker 이미지 실행 시 'bundle5' 모듈 오류

AWS Lambda에서 Docker 이미지를 실행할 때 다음과 같은 오류가 발생할 경우:
```
Error: Cannot find module './bundle5'
Require stack:
- /var/task/node_modules/.pnpm/next@15.2.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/webpack/webpack.js
```

이 문제는 다음과 같은 원인으로 발생할 수 있습니다:

1. **Node.js 버전 불일치**: Dockerfile에서 사용하는 Node.js 버전과 package.json에서 요구하는 버전이 다를 경우 발생할 수 있습니다.

   해결 방법:
   ```dockerfile
   # 변경 전
   FROM node:22-alpine AS base
   FROM public.ecr.aws/lambda/nodejs:22 AS runner

   # 변경 후
   FROM node:20-alpine AS base
   FROM public.ecr.aws/lambda/nodejs:20 AS runner
   ```

2. **Next.js 버전 문제**: 'latest' 버전을 사용하면 빌드 시점에 따라 다른 버전이 설치될 수 있어 일관성이 떨어집니다.

   해결 방법:
   ```json
   // 변경 전
   "next": "latest",

   // 변경 후
   "next": "14.1.0",
   ```

3. **개발 모드 설정 문제**: Lambda 환경에서는 개발 모드가 아닌 프로덕션 모드로 실행해야 합니다.

   해결 방법:
   ```javascript
   // 변경 전
   const dev = true;

   // 변경 후
   const dev = process.env.NODE_ENV !== 'production';
   ```

이러한 변경을 통해 Node.js 버전을 일관되게 유지하고, Next.js 버전을 명시적으로 지정하며, 환경에 따라 적절한 모드로 실행되도록 설정하여 문제를 해결할 수 있습니다.

## 11. 향후 개선 계획

- 추가 인증 제공자 통합 (Twitter, Apple, Microsoft 등)
- 사용자 역할 기반 접근 제어 (RBAC) 구현
- 다국어 지원 추가
- 테스트 자동화 (Jest, Playwright)
- 성능 최적화 및 번들 크기 감소
- 보안 강화 (CSRF 보호, 속도 제한 등)
- 사용자 프로필 관리 기능 추가
- 모니터링 및 로깅 시스템 강화
