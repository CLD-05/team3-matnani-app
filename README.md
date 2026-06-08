# 맛난이(Matnani)

동네 기반 못난이 식품 거래 서비스 프론트엔드 프로젝트입니다.  
사용자는 가까운 동네의 못난이 상품을 탐색하고, 상품을 등록하거나 예약 흐름을 확인할 수 있습니다.

## 기술 스택

- React
- Vite
- JavaScript
- CSS
- lucide-react

## 실행 방법

```bash
npm install
npm run dev
```

개발 서버 실행 후 브라우저에서 아래 주소로 접속합니다.

```txt
http://127.0.0.1:5173
```
<img width="432" height="130" alt="image" src="https://github.com/user-attachments/assets/af2ac3f2-11f6-4ed8-90f6-a5b649e05c91" />
(다음과 같이 뜹니다)

포트가 이미 사용 중이면 Vite가 다른 포트를 안내합니다.

## 주요 기능

- 홈 화면
  - 서비스 배너
  - 추천 상품
  - 마감 임박 상품
  - 상품 미리보기

- 못난이 장터
  - 전체 상품 목록
  - 카테고리 필터
  - 지역 검색 필터
  - 판매 상태 필터
  - 정렬 기능

- 상품 등록
  - 상품 정보 입력
  - 동네 검색
  - 픽업 장소/시간 입력
  - 원가/할인가 입력
  - 할인율 자동 계산
  - 더미 상품 등록 처리

- 로그인/회원가입
  - 임시 테스트 로그인
  - 일반 회원가입
  - 사업자 회원가입

- 예약 내역
  - 구매자 예약 요청 확인
  - 예약 취소 처리

- 구매/판매 내역
  - 거래 완료 구매 내역 조회
  - 판매 예약 수락/거절/완료 처리

- 후기
  - 거래 완료 상품에 별점(1~5) + 내용 후기 작성
  - 후기 수정 / 삭제
  - 내가 쓴 후기 목록 조회

## 파일 트리

```txt
team3-matnani-app/
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── styles.css
    ├── components/
    │   ├── Header.jsx
    │   ├── ProductCard.jsx
    │   ├── HomeSection.jsx
    │   ├── PageIntro.jsx
    │   ├── FilterGroup.jsx
    │   └── RegionSearchPanel.jsx
    ├── pages/
    │   ├── HomePage.jsx
    │   ├── MarketPage.jsx
    │   ├── ProductDetailPage.jsx
    │   ├── ProductCreatePage.jsx
    │   ├── LoginPage.jsx
    │   ├── SignupPage.jsx
    │   ├── BusinessSignupPage.jsx
    │   ├── MyPage.jsx
    │   ├── ReservationsPage.jsx
    │   ├── TransactionHistoryPage.jsx
    │   ├── ReviewNewPage.jsx
    │   └── MyReviewsPage.jsx
    ├── data/
    │   ├── constants.js
    │   ├── products.js
    │   ├── reservations.js
    │   └── reviews.js
    └── utils/
        └── time.js
```

## 폴더 및 파일 설명

### 루트 파일

| 파일 | 설명 |
| --- | --- |
| `index.html` | Vite가 사용하는 기본 HTML 파일입니다. |
| `package.json` | 프로젝트 실행 스크립트와 의존성 정보를 관리합니다. |
| `package-lock.json` | 설치된 패키지 버전을 고정합니다. |
| `README.md` | 프로젝트 설명 문서입니다. |

### `src/main.jsx`

React 앱의 진입점입니다.  
`App.jsx`를 불러와 `#root`에 렌더링합니다.

### `src/App.jsx`

앱 전체 흐름을 관리합니다.

- 현재 경로 관리
- 로그인 상태 관리
- 더미 상품/예약/후기 목록 상태 관리
- 페이지 전환 처리
- 상품 등록, 예약, 예약 상태 변경, 후기 추가/수정/삭제 처리

### `src/styles.css`

전체 UI 스타일을 관리하는 전역 CSS 파일입니다.

- 레이아웃
- 헤더
- 상품 카드
- 장터 필터
- 상품 등록 폼
- 로그인/회원가입 화면
- 예약/거래 내역 화면
- 후기 작성/목록 화면
- 반응형 스타일

## `src/components`

재사용 가능한 UI 컴포넌트 폴더입니다.

| 파일 | 설명 |
| --- | --- |
| `Header.jsx` | 상단 로고, 메뉴, 동네 표시, 로그인/로그아웃 버튼을 담당합니다. |
| `ProductCard.jsx` | 상품 이미지, 상태, 가격, 할인율, 마감 시간을 보여주는 상품 카드입니다. |
| `HomeSection.jsx` | 홈 화면의 추천 상품, 마감 임박 상품, 상품 미리보기 섹션을 구성합니다. |
| `PageIntro.jsx` | 장터/상품 등록 등 페이지 상단 소개 영역입니다. |
| `FilterGroup.jsx` | 카테고리, 판매 상태 같은 필터 버튼 묶음을 표시합니다. |
| `RegionSearchPanel.jsx` | 동 이름을 검색해 `시/구/동` 형식으로 지역을 선택하는 패널입니다. |

## `src/pages`

페이지 단위 컴포넌트 폴더입니다.

| 파일 | 설명 |
| --- | --- |
| `HomePage.jsx` | 홈 화면입니다. 배너, 추천 상품, 마감 임박 상품, 상품 미리보기를 보여줍니다. |
| `MarketPage.jsx` | 못난이 장터 화면입니다. 상품 목록과 필터/정렬 기능을 제공합니다. |
| `ProductDetailPage.jsx` | 상품 상세 화면입니다. 이미지, 가격, 픽업 정보, 비밀 댓글, 예약 버튼을 표시합니다. |
| `ProductCreatePage.jsx` | 상품 등록 화면입니다. 더미데이터가 기본 입력되어 있고, 등록 시 더미 상품이 추가됩니다. |
| `LoginPage.jsx` | 로그인 화면입니다. 테스트 계정으로 임시 로그인할 수 있습니다. |
| `SignupPage.jsx` | 일반 회원가입 화면입니다. |
| `BusinessSignupPage.jsx` | 사업자 회원가입 화면입니다. |
| `MyPage.jsx` | 마이페이지 화면입니다. 프로필, 통계, 메뉴 목록을 제공합니다. |
| `ReservationsPage.jsx` | 예약 내역 화면입니다. 구매자 예약 상태 확인 및 취소 처리를 합니다. |
| `TransactionHistoryPage.jsx` | 구매/판매 내역 화면입니다. `type` prop으로 구매자/판매자 뷰를 전환합니다. |
| `ReviewNewPage.jsx` | 후기 작성 화면입니다. 거래 완료 예약에 대해 별점과 내용을 입력합니다. |
| `MyReviewsPage.jsx` | 내가 쓴 후기 목록 화면입니다. 후기 수정 및 삭제 기능을 제공합니다. |

## `src/data`

더미 데이터와 상수 값을 관리합니다.

| 파일 | 설명 |
| --- | --- |
| `constants.js` | 카테고리, 지역 목록, 상품 상태, 정렬 옵션, 테스트 계정을 관리합니다. |
| `products.js` | 화면 확인용 더미 상품 목록을 관리합니다. |
| `reservations.js` | 더미 예약 목록과 예약 상태 레이블/색상 정보를 관리합니다. |
| `reviews.js` | 화면 확인용 더미 후기 목록을 관리합니다. |

## `src/utils`

공통 유틸 함수 폴더입니다.

| 파일 | 설명 |
| --- | --- |
| `time.js` | 상품 마감 시간을 `n일 HH:MM:SS` 또는 `HH:MM:SS` 형식으로 변환합니다. |

## 테스트 계정

```txt
이메일: user@test.com
비밀번호: 1234
```

현재 로그인은 백엔드 API 연결 전 화면 확인을 위한 임시 로그인입니다.

## 라우팅 구조

| 경로 | 화면 | 인증 필요 |
| --- | --- | --- |
| `/` | 홈 / 상품 목록 | ❌ |
| `/market` | 못난이 장터 | ❌ |
| `/products/:productId` | 상품 상세 | ❌ |
| `/products/new` | 상품 등록 | ✅ |
| `/login` | 로그인 | ❌ |
| `/signup` | 일반 회원가입 | ❌ |
| `/signup/business` | 사업자 회원가입 | ❌ |
| `/mypage` | 마이페이지 | ✅ |
| `/mypage/reservations` | 예약 내역 | ✅ |
| `/mypage/purchases` | 구매 내역 | ✅ |
| `/mypage/sales` | 판매 내역 | ✅ |
| `/mypage/reviews` | 내가 쓴 후기 | ✅ |
| `/reviews/new/:reservationId` | 후기 작성 | ✅ |

## 현재 구현 상태

- 백엔드 API 연결 전 단계입니다.
- 모든 기능은 더미 데이터 기반으로 동작합니다.
- 상품 등록, 예약, 후기 작성/수정/삭제는 React 상태에만 반영됩니다.
- 새로고침하면 변경 사항은 초기 더미 데이터로 복원됩니다.

## 추후 연결 예정 API

- `GET /api/products`, `GET /api/products/{productId}`
- `POST /api/auth/login`, `POST /api/auth/signup`, `POST /api/auth/logout`
- `POST /api/products`, `PATCH /api/products/{productId}`, `DELETE /api/products/{productId}`
- `GET /api/regions`
- `POST /api/images/presigned-url`
- `POST /api/products/{productId}/reservations`
- `PATCH /api/reservations/{reservationId}/status`
- `GET /api/mypage/reservations`, `GET /api/mypage/purchases`, `GET /api/mypage/sales`
- `POST /api/reservations/{reservationId}/reviews`
- `PATCH /api/reviews/{reviewId}`, `DELETE /api/reviews/{reviewId}`
- `GET /api/mypage/reviews`
