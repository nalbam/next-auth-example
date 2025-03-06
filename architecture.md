# Next Auth Example 아키텍처

## 개요

이 프로젝트는 Next.js와 NextAuth.js를 사용한 인증 예제 애플리케이션입니다. 이 애플리케이션은 다음과 같은 기술 스택을 사용합니다:

- **프론트엔드**: Next.js, React, TailwindCSS
- **인증**: NextAuth.js (beta)
- **배포**: AWS Lambda, API Gateway, ECR
- **CI/CD**: GitHub Actions
- **인프라**: Serverless Framework

## 시스템 아키텍처

```mermaid
graph TD
    A[GitHub Repository] -->|Push to main| B[GitHub Actions]
    B -->|Build Docker Image| C[AWS ECR]
    B -->|Deploy| D[Serverless Framework]
    D -->|Deploy| E[AWS Lambda]
    E -->|Expose API| F[API Gateway]
    F -->|Serve| G[End Users]
```

## 배포 프로세스

1. 개발자가 코드를 main/master 브랜치에 푸시합니다.
2. GitHub Actions 워크플로우가 트리거됩니다.
3. 워크플로우는 다음 작업을 수행합니다:
   - 버전 범프
   - GitHub 릴리스 생성
   - Docker 이미지 빌드
   - AWS ECR에 이미지 푸시
   - Serverless Framework를 사용하여 AWS Lambda에 배포

## 애플리케이션 구조

- **app.js**: Express와 Next.js를 통합하는 서버 코드
- **app-local.js**: 로컬 개발 환경에서 애플리케이션을 실행하기 위한 스크립트
- **lambda.js**: AWS Lambda 핸들러 함수
- **next.config.js**: Next.js 설정 (standalone 출력, 이미지 최적화 비활성화 등)
- **serverless.yml**: Serverless Framework 설정
- **auth.ts**: NextAuth.js 설정
- **app/**: Next.js 애플리케이션 코드
- **components/**: React 컴포넌트
- **lib/**: 유틸리티 함수

## Docker 이미지 구성

Docker 이미지는 멀티 스테이지 빌드를 사용하여 최적화되어 있습니다:

1. **빌드 단계**: Node.js 환경에서 Next.js 애플리케이션을 빌드합니다.
2. **실행 단계**: 빌드된 애플리케이션과 필요한 의존성만 포함하는 경량화된 이미지를 생성합니다.

실행 단계에서는 다음과 같은 환경 변수와 설정이 적용됩니다:
- `NODE_ENV=production`: 프로덕션 모드로 실행
- `NODE_PATH=/usr/local/lib/node_modules`: 전역 설치된 모듈을 require()로 불러올 수 있도록 설정
- 필요한 패키지(express, @vendia/serverless-express, source-map-support)를 전역으로 설치

## 주요 문제 해결

### @vendia/serverless-express 모듈 로드 오류

**문제**: Lambda 함수 실행 시 `Error: Cannot find module '@vendia/serverless-express'` 오류 발생

**원인**: Docker 이미지 내에서 `@vendia/serverless-express` 모듈을 전역으로 설치했지만, Node.js에서 전역으로 설치된 모듈은 `require()`로 직접 불러올 수 없음

**해결책**: Dockerfile에 `NODE_PATH=/usr/local/lib/node_modules` 환경 변수를 추가하여 전역 모듈을 `require()`로 불러올 수 있도록 설정
