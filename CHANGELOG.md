# 변경 이력

## 2025-03-06
- AWS Lambda Docker 배포를 위한 설정 추가
  - lambda.js 파일 생성 (serverless-express를 사용하여 Express 앱을 Lambda 핸들러로 변환)
  - lambda.js 수정 (직접 실행 시 서버로 동작하도록 기능 추가)
  - Dockerfile 수정 (Lambda 환경에서 필요한 패키지 설치 및 CMD 지시문 변경)
  - serverless.yml 수정 (컨테이너 이미지 기반 배포 설정 및 환경 변수 설정)
  - GitHub Actions 워크플로우 수정 (환경 변수 설정)
  - ARCHITECTURE.md 업데이트 (Lambda 배포 관련 내용 추가)
- Docker 빌드 오류 수정
  - Dockerfile의 패키지 관리자를 pnpm에서 npm으로 변경
  - `--no-package-lock` 옵션을 추가하여 패키지 무결성 검사 관련 오류 해결
