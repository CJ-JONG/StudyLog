StudyLog API Specification

1. 기본 정보

Backend local URL: http://localhost:8080

Browser-facing base URL in development: /api

Content-Type: application/json

인증 방식: JWT Bearer access token

날짜: YYYY-MM-DD

일시: ISO 8601 문자열

프론트엔드의 Axios 인스턴스가 baseURL: '/api'를 사용한다면 API 함수에는 /members/login, /categories, /studylogs처럼 /api 이후의 경로만 작성합니다.

2. 인증 원칙

회원가입과 로그인을 제외한 API는 인증이 필요합니다.

Authorization: Bearer <accessToken>

중요:

프론트엔드는 memberId를 보내지 않습니다.

쿼리 파라미터, URL 경로, 요청 본문 어디에도 memberId를 포함하지 않습니다.

백엔드는 JWT에서 현재 회원 ID를 읽습니다.

다른 사용자의 카테고리나 공부 기록에는 접근할 수 없어야 합니다.

3. 공통 타입

export interface MemberResponse {
  id: number
  email: string
  nickname: string
}

export interface LoginResponse {
  accessToken: string
  tokenType: string
  member: MemberResponse
}

export interface CategoryResponse {
  id: number
  name: string
}

export interface StudyLogResponse {
  id: number
  categoryId: number
  categoryName: string
  title: string
  content: string
  studyDate: string
  studyMinutes: number
  createdAt: string
  updatedAt: string
}

export interface ApiErrorResponse {
  timestamp?: string
  status?: number
  error?: string
  message?: string
  path?: string
  errors?: unknown
}

Java의 Long은 JSON에서 숫자로 전달되므로 TypeScript에서는 number를 사용합니다.

4. 회원 API

4.1 회원가입

POST /api/members

인증: 불필요

요청:

{
  "email": "study@example.com",
  "password": "password123!",
  "nickname": "찬종"
}

요청 타입:

export interface MemberSignupRequest {
  email: string
  password: string
  nickname: string
}

성공 응답 본문:

{
  "id": 1,
  "email": "study@example.com",
  "nickname": "찬종"
}

프론트엔드 처리:

성공한 뒤 로그인 페이지로 이동합니다.

중복 이메일 등 백엔드 오류의 message를 폼에 표시합니다.

백엔드가 회원가입 성공 시 본문 없이 2xx를 반환하도록 구현되어 있다면 성공 상태 자체를 기준으로 처리하고 로그인 페이지로 이동합니다.

4.2 로그인

POST /api/members/login

인증: 불필요

요청:

{
  "email": "study@example.com",
  "password": "password123!"
}

요청 타입:

export interface MemberLoginRequest {
  email: string
  password: string
}

성공 응답:

{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "member": {
    "id": 1,
    "email": "study@example.com",
    "nickname": "찬종"
  }
}

프론트엔드 처리:

accessToken을 localStorage의 accessToken 키에 저장합니다.

비밀번호는 저장하지 않습니다.

로그인 성공 후 /dashboard로 이동합니다.

로그인 실패 시 기존 토큰을 인증된 것으로 취급하지 않습니다.

4.3 내 정보 조회

GET /api/members/me

인증: 필요

성공 응답:

{
  "id": 1,
  "email": "study@example.com",
  "nickname": "찬종"
}

프론트엔드 처리:

새로고침 시 저장된 access token의 유효성을 확인하는 데 사용합니다.

401이면 토큰을 삭제하고 /login으로 이동합니다.

5. 카테고리 API

모든 카테고리 API는 인증이 필요하며, 현재 로그인한 회원의 카테고리만 처리합니다.

5.1 카테고리 전체 조회

GET /api/categories

성공 응답:

[
  {
    "id": 1,
    "name": "백엔드"
  },
  {
    "id": 2,
    "name": "알고리즘"
  }
]

카테고리가 없으면 빈 배열 []을 반환하는 것으로 처리합니다.

5.2 카테고리 생성

POST /api/categories

요청:

{
  "name": "JPA"
}

요청 타입:

export interface CategoryCreateRequest {
  name: string
}

성공 응답 예시:

{
  "id": 3,
  "name": "JPA"
}

백엔드가 생성 ID만 반환하는 현재 구현이라면 응답은 다음과 같을 수 있습니다.

3

프론트엔드는 성공 후 카테고리 목록을 다시 조회하도록 구현하면 두 형식을 모두 안전하게 처리할 수 있습니다.

5.3 카테고리 이름 수정

PATCH /api/categories/{categoryId}

Path variable:

categoryId: 수정할 카테고리 ID

요청:

{
  "name": "Spring/JPA"
}

요청 타입:

export interface CategoryUpdateRequest {
  name: string
}

성공 시 2xx입니다. 응답 본문이 CategoryResponse이거나 비어 있을 수 있으므로, 성공 후 카테고리 목록을 다시 조회합니다.

5.4 카테고리 삭제

DELETE /api/categories/{categoryId}

성공 시 2xx이며 응답 본문은 사용하지 않습니다.

프론트엔드 처리:

삭제 전에 확인 창을 표시합니다.

해당 카테고리를 사용하는 공부 기록 때문에 삭제할 수 없다면 백엔드 오류 메시지를 표시합니다.

삭제 성공 후 카테고리와 공부 기록 목록을 다시 조회합니다.

6. 공부 기록 API

모든 공부 기록 API는 인증이 필요하며, 현재 로그인한 회원의 기록만 처리합니다.

6.1 공부 기록 전체 조회

GET /api/studylogs

성공 응답:

[
  {
    "id": 10,
    "categoryId": 1,
    "categoryName": "백엔드",
    "title": "Spring Security 공부",
    "content": "JWT 인증 필터와 SecurityConfig를 정리했다.",
    "studyDate": "2026-08-16",
    "studyMinutes": 90,
    "createdAt": "2026-08-16T13:20:00",
    "updatedAt": "2026-08-16T14:50:00"
  }
]

기록이 없으면 빈 배열 []을 반환하는 것으로 처리합니다.

프론트엔드는 기본적으로 studyDate 내림차순, 날짜가 같으면 createdAt 내림차순으로 보여줍니다. 서버 정렬 순서에 의존하지 않습니다.

6.2 공부 기록 생성

POST /api/studylogs

요청:

{
  "categoryId": 1,
  "title": "Spring Security 공부",
  "content": "JWT 인증 필터와 SecurityConfig를 정리했다.",
  "studyDate": "2026-08-16",
  "studyMinutes": 90
}

요청 타입:

export interface StudyLogCreateRequest {
  categoryId: number
  title: string
  content: string
  studyDate: string
  studyMinutes: number
}

성공 응답은 생성된 StudyLogResponse입니다. 백엔드가 생성 ID만 반환하는 구현이라면 숫자가 올 수 있으므로, 프론트엔드는 성공 후 전체 목록을 다시 조회하고 /studylogs/{id} 또는 /dashboard로 이동합니다.

6.3 공부 기록 단건 조회

GET /api/studylogs/{studyLogId}

Path variable:

studyLogId: 조회할 공부 기록 ID

성공 응답:

{
  "id": 10,
  "categoryId": 1,
  "categoryName": "백엔드",
  "title": "Spring Security 공부",
  "content": "JWT 인증 필터와 SecurityConfig를 정리했다.",
  "studyDate": "2026-08-16",
  "studyMinutes": 90,
  "createdAt": "2026-08-16T13:20:00",
  "updatedAt": "2026-08-16T14:50:00"
}

6.4 공부 기록 수정

PUT /api/studylogs/{studyLogId}

요청:

{
  "categoryId": 2,
  "title": "Spring Security 복습",
  "content": "JWT 예외 처리까지 복습했다.",
  "studyDate": "2026-08-16",
  "studyMinutes": 120
}

요청 타입:

export interface StudyLogUpdateRequest {
  categoryId: number
  title: string
  content: string
  studyDate: string
  studyMinutes: number
}

성공 응답은 수정된 StudyLogResponse입니다. 응답 본문이 없는 구현이라면 성공 후 단건 또는 목록을 다시 조회합니다.

6.5 공부 기록 삭제

DELETE /api/studylogs/{studyLogId}

성공 시 2xx이며 응답 본문은 사용하지 않습니다.

프론트엔드는 삭제 전 확인 창을 표시하고, 성공 후 /dashboard로 이동하며 목록을 갱신합니다.

7. 오류 처리

오류 응답의 기본 예시:

{
  "timestamp": "2026-08-16T14:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "제목은 필수입니다.",
  "path": "/api/studylogs"
}

실제 전역 예외 응답에 일부 필드가 없다면 프론트엔드는 존재하는 필드만 사용합니다. 사용자 메시지는 다음 우선순위를 따릅니다.

response.data.message

필드 검증 오류에서 추출한 메시지

HTTP 상태에 맞는 한국어 기본 메시지

네트워크 오류 기본 메시지

권장 기본 처리:

상태

프론트엔드 동작

400

입력값 및 백엔드 메시지 표시

401

보호된 요청이면 토큰 삭제 후 로그인 이동

403

접근 권한이 없다는 메시지 표시

404

존재하지 않는 데이터 화면 또는 대시보드 이동 안내

409

중복 또는 현재 상태에서 처리할 수 없다는 메시지 표시

500

잠시 후 다시 시도하라는 메시지 표시

응답 없음

백엔드 실행 여부와 네트워크 연결 확인 안내

8. 최종 연동 확인표

회원가입 요청 필드가 실제 DTO와 일치하는가?

로그인 응답에 accessToken, tokenType, member가 있는가?

/members/me가 Bearer token으로 동작하는가?

카테고리 요청에 memberId가 없는가?

공부 기록 요청에 memberId가 없는가?

카테고리 생성·수정 응답이 객체인지 ID/빈 본문인지 확인했는가?

공부 기록 생성·수정 응답이 객체인지 ID/빈 본문인지 확인했는가?

전역 예외 응답의 message 필드가 화면에 표시되는가?

만료되거나 잘못된 토큰에서 401 처리가 되는가?