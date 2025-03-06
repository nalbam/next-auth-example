# 변경 이력

## 2025-03-06
- Docker 빌드 시 pnpm 서명 검증 오류 해결
  - Dockerfile 수정: corepack 대신 npm을 통해 pnpm 설치
  - Dockerfile 수정: pnpm install 명령어에 `--no-verify-store-integrity` 옵션 추가
  - ARCHITECTURE.md 업데이트: Docker 이미지 구성 설명 수정

- AWS Lambda Docker 배포를 위한 설정 추가
  - lambda.js 파일 생성 (serverless-express를 사용하여 Express 앱을 Lambda 핸들러로 변환)
  - lambda.js 수정 (직접 실행 시 서버로 동작하도록 기능 추가)
  - Dockerfile 수정 (Lambda 환경에서 필요한 패키지 설치 및 CMD 지시문 변경)
  - serverless.yml 수정 (컨테이너 이미지 기반 배포 설정 및 환경 변수 설정)
  - GitHub Actions 워크플로우 수정 (환경 변수 설정)
  - ARCHITECTURE.md 업데이트 (Lambda 배포 관련 내용 추가)
