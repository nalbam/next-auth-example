# 빌드 단계
FROM node:20-alpine AS builder

WORKDIR /app

# 의존성 설치
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# 소스 코드 복사
COPY . .

# Next.js 애플리케이션 빌드
RUN pnpm build

# 실행 단계
FROM node:20-alpine AS runner

WORKDIR /app

# 환경 변수 설정
ENV NODE_ENV=production

# 필요한 패키지 설치
RUN npm install -g express @vendia/serverless-express source-map-support

# 빌드된 애플리케이션 복사
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Lambda 핸들러 파일 복사
COPY lambda.js ./

# 포트 설정
EXPOSE 3000

# Lambda 핸들러 실행
CMD ["node", "-e", "require('./lambda').handler(require('@vendia/serverless-express').createApiGatewayEventV1())"]
