StudyLog Frontend

StudyLog는 사용자가 공부 내용을 카테고리별로 기록하고 관리하는 개인 학습 기록 웹 애플리케이션입니다.

이 저장소는 React 프론트엔드이며, 별도의 Spring Boot 백엔드 API와 통신합니다. 회원가입과 로그인 이후 JWT access token을 이용하여 본인 소유의 카테고리와 공부 기록만 관리합니다.

주요 기능

회원가입

로그인 및 로그인 상태 복원

로그아웃

인증이 필요한 페이지 보호

카테고리 조회, 생성, 이름 수정, 삭제

공부 기록 조회, 상세 보기, 작성, 수정, 삭제

카테고리별 기록 필터링

전체 공부 시간과 기록 수 요약

로딩, 빈 목록, 오류, 삭제 확인 상태 처리

데스크톱 및 모바일 반응형 화면

기술 스택

React

TypeScript

Vite

React Router

Axios

CSS 또는 CSS Modules

개발 환경:

Node.js: 24.13.x

npm: 11.6.x

Backend: Spring Boot, http://localhost:8080

Frontend: Vite, 기본값 http://localhost:5173

프로젝트 문서

AGENTS.md: Codex가 따라야 할 구현 및 검증 규칙

docs/API_SPEC.md: 백엔드 API 계약

docs/FRONTEND_SPEC.md: 화면과 사용자 흐름 명세

Codex로 작업할 때는 반드시 위 문서를 모두 먼저 읽어야 합니다.

실행 방법

1. 패키지 설치

npm install

2. 백엔드 실행

Spring Boot 백엔드를 http://localhost:8080에서 실행합니다.

JWT secret 등의 백엔드 환경 변수는 프론트엔드에 복사하지 않습니다. 프론트엔드는 로그인 API가 반환한 access token만 사용합니다.

3. Vite 프록시 확인

브라우저에서는 /api로 요청하고, Vite가 이를 Spring Boot로 전달하도록 vite.config.ts를 설정합니다.

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})

프론트엔드의 Axios baseURL은 /api를 사용합니다. API 함수에서는 /api/api/...가 되지 않도록 /members/login, /categories처럼 나머지 경로만 작성합니다.

4. 프론트엔드 실행

npm run dev

브라우저에서 http://localhost:5173을 엽니다.

검증 명령어

npm run lint
npm run build

테스트 스크립트가 추가되어 있다면 다음 명령도 실행합니다.

npm test

인증 방식

로그인이 성공하면 백엔드는 다음 형식으로 access token을 반환합니다.

{
  "accessToken": "eyJ...",
  "tokenType": "Bearer",
  "member": {
    "id": 1,
    "email": "study@example.com",
    "nickname": "찬종"
  }
}

프론트엔드는 accessToken을 localStorage에 저장하고, 보호된 API 요청마다 다음 헤더를 붙입니다.

Authorization: Bearer eyJ...

memberId는 요청에 포함하지 않습니다. 백엔드의 JWT 인증 필터와 Spring Security가 현재 사용자를 판별합니다.

Codex CLI 시작 방법

PowerShell에서 프론트엔드 저장소 루트로 이동한 후 실행합니다.

cd C:\Study\studylog-frontend
codex

첫 요청 예시:

AGENTS.md, README.md, docs/API_SPEC.md, docs/FRONTEND_SPEC.md를 모두 읽어줘.

현재 코드를 분석한 다음 StudyLog 프론트엔드를 완성해줘.
백엔드 API 계약은 변경하지 말고, 기존에 동작하는 코드는 보존해.
회원가입, 로그인, 인증 복원, 로그아웃, 카테고리 CRUD,
공부 기록 CRUD와 모든 로딩·오류·빈 상태를 구현해.

구현 후 npm run lint와 npm run build를 실행하고,
발견한 오류를 모두 수정해. 화면만 만들고 끝내지 말고 실제 API와
연결된 흐름을 완성해.

구현 범위 밖

현재 백엔드 계약에 없는 다음 기능은 임의로 만들지 않습니다.

Refresh token

소셜 로그인

비밀번호 찾기

서버 페이지네이션

파일 첨부

관리자 기능

필요해지면 먼저 백엔드 API 계약을 추가한 후 프론트엔드를 확장합니다.