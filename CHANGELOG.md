# 변경 이력

## 2025-03-06

### 추가
- Dockerfile 생성: Docker 이미지 빌드를 위한 멀티 스테이지 Dockerfile 추가
- lambda.js 파일 추가: AWS Lambda 핸들러 함수 구현
- docker-compose.yml 파일 추가: 로컬 테스트를 위한 Docker Compose 설정
- architecture.md 파일 추가: 프로젝트 아키텍처 문서화

### 변경
- package.json: Lambda 핸들러 실행 및 Docker 관련 스크립트 추가
- serverless.yml: image 속성만 사용하도록 수정 (handler 속성 제거)
- Dockerfile: Lambda 핸들러를 명시적으로 지정하는 CMD 설정 추가

### 수정
- 배포 오류 수정: serverless.yml에서 image와 handler를 동시에 사용하는 문제 해결
