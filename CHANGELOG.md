# 변경 이력

## 2025-03-07
- MissingSecret 에러 해결
  - ARCHITECTURE.md 업데이트: AUTH_SECRET 환경 변수 설정 방법 추가

- UntrustedHost 에러 해결
  - auth.ts 수정: trustHost 옵션을 true로 설정하여 AWS Amplify 도메인 신뢰
  - ARCHITECTURE.md 업데이트: NextAuth.js 설정 섹션 추가

## 2025-03-06
- "Endpoint request timed out" 에러 해결 (9차 시도)
  - Dockerfile 수정: 패키지 설치 권한 문제 해결 (nextjs 사용자로 설치)
  - Dockerfile 수정: npm install 옵션 최적화 (--no-fund --no-audit 추가)
  - Dockerfile 수정: 패키지 설치 방식 변경 (package.json 의존성 사용)

- "Endpoint request timed out" 에러 해결 (8차 시도)
  - Dockerfile 수정: ENTRYPOINT와 CMD 지시문 분리
  - serverless.yml 수정: Lambda 함수의 핸들러를 명시적으로 지정 (lambda.handler)

- "Endpoint request timed out" 에러 해결 (7차 시도)
  - Dockerfile 수정: app.js 파일 복사 제거
  - Dockerfile 수정: 전역 모듈 설치를 로컬 설치로 변경
  - Dockerfile 수정: source-map-support 패키지 제거
  - Dockerfile 수정: NODE_PATH 환경 변수 제거

- "Endpoint request timed out" 에러 해결 (6차 시도)
  - lambda.js 수정: 초기화 단계에서 로드하는 모듈 최소화
  - lambda.js 수정: Express 앱 초기화를 첫 번째 요청으로 지연
  - lambda.js 수정: serverlessExpress 모듈 동적 로딩 구현
  - lambda.js 수정: 오류 처리 개선 및 예외 상황 대응

- "Endpoint request timed out" 에러 해결 (5차 시도)
  - serverless.yml 수정: API Gateway 압축 설정 추가 (minimumCompressionSize: 1024)
  - serverless.yml 수정: API Gateway 이름 설정 개선 (shouldStartNameWithService: true)
  - serverless.yml 수정: CORS 설정 상세화 (필요한 헤더 명시적 지정)
  - serverless.yml 수정: X-Next-Init-Bypass 헤더 허용 (초기화 우회 플래그용)
  - serverless.yml 수정: X-Ray 트레이싱 활성화

- "Endpoint request timed out" 에러 해결 (4차 시도)
  - lambda.js 수정: Lambda 초기화 단계에서 Next.js 초기화를 완전히 분리
  - lambda.js 수정: 초기화 중 로딩 페이지 추가 (자동 새로고침 기능 포함)
  - lambda.js 수정: 정적 파일 처리 미들웨어 추가 (Next.js 초기화 전에도 정적 파일 제공)
  - lambda.js 수정: 상태 확인 엔드포인트 개선 (Next.js 초기화 상태 표시)

- "Endpoint request timed out" 에러 해결 (3차 시도)
  - serverless.yml 수정: API Gateway 타임아웃을 30초(최대값)로 설정
  - serverless.yml 수정: API 키 및 사용량 계획 추가

- "Endpoint request timed out" 에러 해결 (2차 시도)
  - lambda.js 수정: Next.js 애플리케이션 지연 초기화 구현
  - lambda.js 수정: /health 엔드포인트 추가로 빠른 응답 제공
  - lambda.js 수정: 백그라운드에서 Next.js 초기화 수행
  - ARCHITECTURE.md 업데이트: 지연 초기화 설명 추가
  - package.json 업데이트: serverless-dotenv-plugin 및 serverless-plugin-warmup 설치
  - .github/workflows/push.yml 수정: Node.js 설정 및 의존성 설치 단계 활성화

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
