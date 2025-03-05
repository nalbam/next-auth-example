# syntax=docker/dockerfile:1
FROM node:23-alpine AS base

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
FROM public.ecr.aws/lambda/nodejs:23 AS runner
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
