# 맛난이(Matnani) Frontend

지역 기반 못난이 식품 거래 서비스 `맛난이`의 React + Vite 프론트엔드 프로젝트입니다.

현재는 백엔드 API 연결 전 단계이며, 프론트 더미 데이터와 React 상태만으로 주요 화면과 거래 흐름을 구현해둔 상태입니다.

## 기술 스택

- React 19
- Vite
- JavaScript
- CSS
- lucide-react

## 실행 방법

```bash
npm install
npm run dev
```

개발 서버 기본 주소:

```txt
http://127.0.0.1:5174
```

빌드 확인:

```bash
npm run build
```

## 테스트 계정

```txt
이메일: user@test.com
비밀번호: 1234
닉네임: 맛난이회원
```

로그인은 현재 백엔드 API 없이 `localStorage`에 mock token/user를 저장하는 방식입니다.

## 주요 구현 기능

### 홈 / 장터

- 홈 추천 상품, 마감 임박 상품 표시
- 맛난이 장터 상품 목록
- 카테고리, 지역, 판매 상태 필터
- 상품명/판매자/지역/카테고리/설명 기준 검색
- 헤더 지역 선택 팝오버

### 상품

- 상품 상세 조회
- 상품 등록
- 상품 수정
  - 판매자 본인 상품일 때만 접근 가능
  - 상품 등록 폼을 재사용
  - 기존 입력값을 유지한 상태로 수정
- 상품 삭제
  - 판매자 본인 상품일 때만 표시
  - `판매중` 상태에서만 삭제 가능
- 상품 등록/수정 날짜 검증
  - 이전 날짜 선택 불가
  - 픽업 종료는 픽업 시작보다 빠를 수 없음
  - 유통기한은 픽업 시작/종료보다 빠를 수 없음

### 예약 / 거래

- 상품 상세에서 예약 요청 생성
- 예약 요청 시 상품 상태를 `예약중`으로 변경
- 구매자 예약 내역 표시
- 판매 내역 탭
  - 내 등록 상품 전체
  - 예약 들어온 상품
  - 거래 완료된 상품
  - 예약 안 된 상품
- 판매자 예약 수락/거절
- 예약 수락 후 취소 가능
- 거래 완료 처리
- 구매 내역에서 후기 작성/보기

### 댓글 / 후기 / 알림

- 상품 상세 비밀 댓글
  - 작성자와 판매자만 확인 가능
  - 구매자는 본인이 쓴 비밀 댓글 스레드에 추가 답글 가능
  - 판매자는 구매자 문의에 답글 가능
- 내가 쓴 후기
- 내게 달린 후기
- 상대방 프로필
  - 판매 상품 대표 목록
  - 전체 판매 상품 보기
  - 전체 후기 / 판매자 후기 / 구매자 후기 탭
- 알림 센터
  - 전체/예약/댓글/거래 필터
  - 알림 클릭 시 읽음 처리
  - 전체 읽음 처리
  - 헤더 읽지 않은 알림 배지

### 인증 접근 제한

비로그인 상태에서는 아래 페이지 접근 시 로그인 페이지로 이동합니다.

- 상품 등록
- 상품 수정
- 마이페이지 하위 페이지
- 후기 작성

## 주요 파일 구조

```txt
src/
  App.jsx
  main.jsx
  styles.css
  components/
    Header.jsx
    ProductCard.jsx
    HomeSection.jsx
    PageIntro.jsx
    FilterGroup.jsx
    RegionSearchPanel.jsx
  api/
    auth.js
    products.js
    reservations.js
    reviews.js
    notifications.js
  pages/
    HomePage.jsx
    MarketPage.jsx
    ProductCreatePage.jsx
    ProductDetailPage.jsx
    ReservationsPage.jsx
    TransactionHistoryPage.jsx
    MyPage.jsx
    MyCommentsPage.jsx
    MyReviewsPage.jsx
    ReceivedReviewsPage.jsx
    ReviewNewPage.jsx
    NotificationsPage.jsx
    SellerProfilePage.jsx
    LoginPage.jsx
    SignupPage.jsx
    BusinessSignupPage.jsx
  data/
    constants.js
    products.js
    reservations.js
    reviews.js
    activity.js
  utils/
    time.js
```

## 현재 데이터 관리 방식

백엔드 연결 전이라 모든 주요 데이터는 `App.jsx`에서 React 상태로 관리합니다.
상태 변경 요청은 `src/api` 폴더의 더미 API 함수를 거치도록 분리되어 있습니다.

```txt
products       상품 목록
reservations   예약/거래 상태
reviews        후기
notifications  알림
currentUser    로그인 사용자
```

초기 더미 데이터는 `src/data` 폴더에서 가져옵니다.

## 백엔드 연결 시 교체할 주요 함수

`src/api` 폴더의 아래 함수들은 현재 더미 응답을 반환합니다.
백엔드 연결 시 각 함수 내부를 실제 API 호출로 교체하면 됩니다.

```txt
auth.js
  getSavedUser
  loginUser
  logoutUser

products.js
  createProduct
  updateProduct
  deleteProduct

reservations.js
  createReservation
  updateReservationStatus

reviews.js
  createReview
  updateReview
  deleteReview

notifications.js
  updateNotificationSetting
  markNotificationAsRead
  markAllNotificationsAsRead
  deleteNotifications
  deleteAllNotifications
```

## 현재 프론트 상태 흐름

### 상품 상태

현재 프론트 표시값:

```txt
판매중
예약중
판매완료
```

백엔드 연결 시 권장 enum:

```txt
ON_SALE
RESERVED
SOLD_OUT
```

프론트에서는 enum을 받아 한글 라벨로 변환하는 방식이 좋습니다.

### 예약 상태

현재 예약 상태 enum:

```txt
REQUESTED   예약 요청
ACCEPTED    예약 수락
CANCELED    예약 취소
COMPLETED   거래 완료
```

예약 상태에 따른 상품 상태 변경:

```txt
예약 요청/수락 -> 상품 예약중
예약 취소     -> 상품 판매중
거래 완료     -> 상품 판매완료
```

## 백엔드 연결 시 주의할 점

- 현재 `seller`, `buyerName`, `sellerName`은 닉네임 문자열 기준입니다.
- 백엔드 연결 시에는 `sellerId`, `buyerId`, `productId`, `reservationId` 기준으로 바꾸는 것이 안전합니다.
- 가격은 백엔드에 숫자로 전달하고, `3,000원` 같은 포맷은 프론트에서 처리하는 것이 좋습니다.
- 날짜는 `pickupStartAt`, `pickupEndAt`, `expiresAt`을 ISO 문자열 기준으로 맞추는 것이 좋습니다.
- 상품 삭제 제한, 후기 1회 작성 제한, 비밀 댓글 권한은 백엔드에서도 반드시 검증해야 합니다.
- 알림 읽음 처리는 `isRead` 또는 `readAt` 필드가 필요합니다.
- 이미지 업로드는 현재 더미 URL입니다. 백엔드/스토리지 방식이 정해지면 `ProductCreatePage.jsx`의 이미지 선택 영역과 연결하면 됩니다.

## API 연결 예상 목록

```txt
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
POST   /api/images/presigned-url
```

## 백엔드 전달용 요약

프론트는 백엔드 API 연결 전 화면/상태 흐름 검증용으로 구현되어 있습니다.

상품, 예약, 후기, 댓글, 알림의 주요 UX는 더미 데이터 기준으로 동작하며, 백엔드 연결 시에는 `App.jsx`의 상태 변경 함수들을 API 요청으로 교체하면 됩니다.
