# 변경 이력

## 2025-03-06
- "Endpoint request timed out" 에러 해결 (2차 시도)
  - lambda.js 수정: Next.js 애플리케이션 지연 초기화 구현
  - lambda.js 수정: /health 엔드포인트 추가로 빠른 응답 제공
  - lambda.js 수정: 백그라운드에서 Next.js 초기화 수행
  - ARCHITECTURE.md 업데이트: 지연 초기화 설명 추가

- "Endpoint request timed out" 에러 해결 (1차 시도)
  - serverless.yml 수정: Lambda 함수 타임아웃을 29초에서 60초로 증가
  - serverless.yml 수정: Lambda 함수 메모리 크기를 2048MB에서 3072MB로 증가
  - serverless.yml 수정: X-Ray 트레이싱 활성화
  - serverless.yml 수정: Warm-up 플러그인 활성화 (5분마다 Lambda 함수 호출)
  - .github/workflows/push.yml 수정: Warm-up 플러그인 설치 단계 활성화
  - ARCHITECTURE.md 업데이트: AWS Lambda 배포 설정 설명 업데이트

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
