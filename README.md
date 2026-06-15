# 맛난이 (Matnani)

지역 기반 못난이 식품 픽업 거래 서비스입니다.  
외관상 흠이 있거나 규격 외로 판정된 농산물·식품을 저렴하게 사고팔 수 있는 동네 직거래 플랫폼입니다.

---

## 서비스 소개

- 판매자가 못난이 식품 상품을 등록하고 픽업 일정을 설정합니다.
- 구매자는 원하는 지역을 선택해 근처 상품을 확인하고 예약합니다.
- 판매자가 예약을 수락하면 약속된 장소에서 픽업 거래가 이루어집니다.
- 거래 완료 후 양방향 후기를 작성할 수 있습니다.

---

## 기술 스택

### Frontend
- React 19 + Vite
- JavaScript
- CSS
- lucide-react

### Backend
- Spring Boot 4.0.6
- Java 17
- Spring Security + JWT
- Spring Data JPA
- MySQL 8
- Redis
- AWS S3

---

## 프로젝트 구조

```
team3-matnani-app/
├── frontend/          # React + Vite 프론트엔드
└── backend/           # Spring Boot 백엔드
```

---

## 실행 방법

### 사전 준비

- Java 17
- Node.js 18+
- MySQL 8 (스키마명: `matnani`)
- Redis

### Backend

`backend/src/main/resources/application-local.properties` 파일을 직접 생성하고 아래 값을 설정합니다.  
(이 파일은 `.gitignore`에 포함되어 있습니다. 절대 커밋하지 마세요.)

```properties
spring.datasource.password=<MySQL 비밀번호>
jwt.secret=<JWT 시크릿 키 (32자 이상 권장)>
business.api.key=<사업자 인증 API 키>
cloud.aws.credentials.access-key=<AWS Access Key>
cloud.aws.credentials.secret-key=<AWS Secret Key>
cloud.aws.s3.bucket=<S3 버킷명>
cloud.aws.s3.cdn-url=<CDN URL>
```

```bash
cd backend
./gradlew bootRun
```

기본 포트: `http://localhost:8080`  
최초 실행 시 `data.sql`의 지역 데이터가 자동으로 삽입됩니다.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

기본 주소: `http://127.0.0.1:5174`

---

## 주요 기능

### 홈 / 장터

- 타임특가 · 추천 상품 · 마감 임박 · 상품 미리보기 섹션
- 선택된 지역 기준 상품 필터링 및 히어로 텍스트 동적 변경
- 카테고리 · 지역 · 판매 상태 필터
- 상품명 / 판매자 / 지역 / 카테고리 / 설명 기준 검색

### 지역 선택

- 시/도 → 구/군 → 읍/면/동 3단계 캐스케이드 선택
- 동 이름 직접 검색 지원
- 선택된 지역 localStorage 저장 · 복원

### 상품

- 상품 등록 / 수정 / 삭제
- 픽업 일정 · 유통기한 날짜 검증
- 이미지 업로드 (AWS S3)
- 판매자 본인만 수정 · 삭제 가능
- `판매중` 상태에서만 삭제 가능

### 예약 / 거래

- 상품 상세에서 예약 요청
- 판매자 예약 수락 / 거절 / 취소
- 거래 완료 처리
- 구매 내역 · 판매 내역 조회

### 후기 / 댓글 / 알림

- 거래 완료 후 양방향 후기 작성
- 상품 상세 비밀 댓글 (작성자 · 판매자만 열람)
- 알림 센터 (예약 · 댓글 · 거래 필터, 읽음 처리)
- 상대방 프로필 및 후기 탭

### 인증

- 일반 회원가입 / 로그인 (JWT)
- 사업자 회원가입 (사업자 번호 인증 API 연동)
- 비로그인 시 상품 등록 · 마이페이지 접근 차단

---

## API 목록

```
POST   /api/auth/login
POST   /api/auth/signup
POST   /api/auth/business-signup

GET    /api/products
GET    /api/products/{productId}
POST   /api/products
PUT    /api/products/{productId}
DELETE /api/products/{productId}

POST   /api/products/{productId}/reservations
GET    /api/me/reservations
GET    /api/me/sales
PATCH  /api/reservations/{reservationId}/status

GET    /api/me/reviews
GET    /api/me/received-reviews
POST   /api/reservations/{reservationId}/reviews
PUT    /api/reviews/{reviewId}
DELETE /api/reviews/{reviewId}

GET    /api/products/{productId}/comments
POST   /api/products/{productId}/comments
POST   /api/comments/{commentId}/replies

GET    /api/notifications
PATCH  /api/notifications/{notificationId}/read
PATCH  /api/notifications/read-all

GET    /api/regions
GET    /api/regions?parentId={id}
GET    /api/regions/search?q={keyword}

POST   /api/images/presigned-url
```

---

## 주요 상태 값

### 상품 상태

| Enum | 표시 |
|------|------|
| `ON_SALE` | 판매중 |
| `RESERVED` | 예약중 |
| `SOLD_OUT` | 판매완료 |

### 예약 상태

| Enum | 설명 |
|------|------|
| `REQUESTED` | 예약 요청 |
| `ACCEPTED` | 예약 수락 |
| `CANCELED` | 예약 취소 |
| `COMPLETED` | 거래 완료 |

---

## 보안 주의사항

- `application-local.properties`는 절대 커밋하지 않습니다.
- JWT 시크릿 키, DB 비밀번호, AWS 자격증명, API 키는 환경변수 또는 로컬 설정 파일로만 관리합니다.
