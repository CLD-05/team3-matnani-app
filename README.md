<div align="center">

# 🥐🥨 맛난이 (Matnani)

</div>

맛과 품질에는 문제가 없지만 모양 때문에 상품 가치가 떨어진 식품이나, 소비기한이 임박해 폐기될 예정인 식품을 동네 주민 및 소상공인과 직접 거래할 수 있도록 연결한 로컬 마켓입니다.

<div align="center">

**서비스 주소**: https://matnani.store

</div>

<hr style="border: 2px solid #000;">

## 📋 서비스 소개

- 사업자 번호로 가입한 판매자가 상품을 등록하고 픽업 마감 기간을 설정합니다. 이때 픽업 기한이 지나면 게시물은 자동으로 내려갑니다.
- 구매자는 원하는 지역을 선택해 근처 상품을 확인하고 예약합니다.
- 판매자가 예약을 수락하면 구매자가 판매자 가게로 방문하여 직거래가 이루어집니다.
- 거래 완료 후 후기를 작성할 수 있습니다.
- 구매자는 마이페이지에서 절약 금액, 환경 포인트 및 거래 내역을 확인할 수 있습니다.


<br>

### 🖥️ 서비스 화면




<br>

<hr style="border: 2px solid #000;">


## 🔗 관련 레포지토리

| 레포지토리 | 설명 |
|-----------|------|
| [team3-matnani-app](https://github.com/CLD-05/team3-matnani-app) | 프론트엔드 + 백엔드 소스 코드 |
| [team3-matnani-config](https://github.com/CLD-05/team3-matnani-config) | Kubernetes 매니페스트 (ArgoCD GitOps) |
| [team3-matnani-infra](https://github.com/CLD-05/team3-matnani-infra) | AWS 인프라 (Terraform) |

<br>

<hr style="border: 2px solid #000;">


## 👥 팀원

| 이름  | 역할                                                        |
|-----|-----------------------------------------------------------|
| 공통  | 기획, 모니터링, DB                                              |
| 이호  | 백엔드 API 설계 및 개발, k6 부하 테스트                                |
| 이상혁 | Terraform IaC, K8s Manifest 작성, AWS FIS 기반 카오스 엔지니어링      |
| 송원준 | Terraform IaC, Amazon Q Developer-Slack 알림 파이프라인 구축       |
| 최민규 | 프론트엔드 개발, 백엔드 API 개발, k6 부하 테스트                           |
| 김원호 | 프론트엔드 개발                                                  |
| 이유은 | Terraform IaC, ArgoCD 기반 GitOps CI/CD 파이프라인 구축, k6 부하 테스트 |

<br>

<hr style="border: 2px solid #000;">

## ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| 홈 / 장터 | 타임특가 · 마감 임박 · 추천 상품 섹션, 지역/카테고리/상태 필터, 키워드 검색 |
| 지역 선택 | 시/도 → 구/군 → 읍/면/동 3단계 선택, 동 이름 직접 검색, localStorage 저장 |
| 상품 | 등록 / 수정 / 삭제, 이미지 업로드 (S3 Presigned URL), 픽업 일정·유통기한 검증 |
| 예약 / 거래 | 예약 요청 → 수락/거절/취소 → 거래 완료, 구매·판매 내역 조회 |
| 후기 | 거래 완료 후 양방향 후기 작성 / 수정 / 삭제 |
| 비밀 댓글 | 상품 상세 비밀 댓글 (작성자·판매자만 열람), 대댓글 지원 |
| 알림 | 예약·댓글·거래 알림, 필터 및 읽음 처리 |
| 인증 | 일반 / 사업자 회원가입 (사업자 번호 인증 API), JWT 로그인 |
| 스케줄러 | 노쇼 자동 처리, 상품 만료 처리, 픽업 30분 전 알림 발송 |

<br>

<hr style="border: 2px solid #000;">

## ⛏️ 기술 스택

<div align="center">

### Backend

![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white&style=flat-square) ![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.6-6DB33F?logo=springboot&logoColor=white&style=flat-square) ![Spring Security](https://img.shields.io/badge/Spring_Security_JWT-6DB33F?logo=springsecurity&logoColor=white&style=flat-square) ![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white&style=flat-square) ![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white&style=flat-square) ![AWS S3](https://img.shields.io/badge/AWS_S3-569A31?logo=amazons3&logoColor=white&style=flat-square)

</div>

- Spring Boot 4.0.6 / Java 17 
- Spring Security + JWT 
- Spring Data JPA 
- MySQL 8 / Redis (prod: TLS) 
- AWS S3 + CloudFront (이미지 CDN) 

---

<div align="center">

### Frontend

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black&style=flat-square) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black&style=flat-square) ![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white&style=flat-square)

</div>

- React 19 + Vite 7
- JavaScript / CSS 
- lucide-react

---

<div align="center">

### Infrastructure

![AWS EKS](https://img.shields.io/badge/AWS_EKS-FF9900?logo=amazonaws&logoColor=white&style=flat-square) ![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?logo=kubernetes&logoColor=white&style=flat-square) ![Terraform](https://img.shields.io/badge/Terraform_IaC-844FBA?logo=terraform&logoColor=white&style=flat-square) ![ArgoCD](https://img.shields.io/badge/Argo_CD_GitOps-EF7B4D?logo=argo&logoColor=white&style=flat-square) ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?logo=githubactions&logoColor=white&style=flat-square) ![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?logo=prometheus&logoColor=white&style=flat-square) ![Grafana](https://img.shields.io/badge/Grafana-F46800?logo=grafana&logoColor=white&style=flat-square) ![Amazon Q](https://img.shields.io/badge/Amazon_Q-AIOps-FF9900?logo=amazonaws&logoColor=white&style=flat-square) ![Slack](https://img.shields.io/badge/Slack-4A154B?logo=slack&logoColor=white&style=flat-square) ![k6](https://img.shields.io/badge/k6-7D64FF?logo=k6&logoColor=white&style=flat-square)

</div>


- AWS EKS (dev / prod 클러스터 분리)
- AWS RDS MySQL (prod: Multi-AZ)
- AWS ElastiCache Redis (prod: Multi-node, TLS)
- AWS CloudFront + Route 53 (`matnani.store`)
- AWS ALB + Ingress Controller
- AWS SSM Parameter Store 
- ArgoCD (GitOps, App of Apps 패턴)
- GitHub Actions (CI/CD)
- AIOps
- k6 부하테스트
- Prometheus + Grafana + Alertmanager + slack

<br>

<hr style="border: 2px solid #000;">

## 📁 프로젝트 구조

```
team3-matnani-app/
├── frontend/
│   ├── src/
│   │   ├── api/                  # API 클라이언트 (auth, products, reservations 등)
│   │   ├── components/           # 공통 컴포넌트 (Header, ProductCard, FilterGroup 등)
│   │   ├── hooks/                # 커스텀 훅 (useRegionSelector)
│   │   ├── pages/                # 페이지 컴포넌트
│   │   │   ├── HomePage.jsx
│   │   │   ├── MarketPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── ProductCreatePage.jsx
│   │   │   ├── ReservationsPage.jsx
│   │   │   ├── TransactionHistoryPage.jsx
│   │   │   ├── MyPage.jsx
│   │   │   ├── NotificationsPage.jsx
│   │   │   └── ...
│   │   └── utils/                # 유틸리티 함수
│   └── index.html
└── backend/
    └── src/main/java/com/example/matnani/
        ├── config/               # Redis, S3, Security 설정
        ├── controller/           # REST 컨트롤러
        ├── service/              # 비즈니스 로직
        │   ├── ProductService.java
        │   ├── ReservationService.java
        │   ├── RedisStockService.java    # Redis 재고 동기화
        │   ├── DiscountQueueService.java
        │   └── ...
        ├── domain/
        │   ├── entity/           # JPA 엔티티 (Product, Reservation, Review 등)
        │   └── enums/            # 상태 Enum
        ├── dto/                  # Request / Response DTO
        ├── repository/           # JPA Repository
        ├── scheduler/            # 노쇼 처리, 상품 만료, 예약 알림
        ├── security/             # JWT 필터 / 인증
        └── exception/            # 글로벌 예외 처리
```

<br>




### 🪜️ 아키텍처

```
사용자
  └─ https://matnani.store
        └─ Route 53 (가비아 NS → AWS)
              └─ CloudFront
                    ├─ /*        → S3 (React 정적 파일)
                    ├─ /images/* → S3 (이미지 CDN)
                    └─ /api/*    → ALB
                                    └─ EKS (Spring Boot)
                                          ├─ RDS MySQL
                                          ├─ ElastiCache Redis
                                          └─ S3 (이미지 업로드)
```


**환경 분리**

| 구분 | dev | prod |
|------|-----|------|
| EKS 클러스터 | 별도 | 별도 |
| RDS | Single-AZ | Multi-AZ |
| Redis | 단일 노드 | Multi-node + TLS |
| 도메인 | CloudFront URL | matnani.store |

<br>

<hr style="border: 2px solid #000;">

## 🔄 CI/CD 흐름

```
1. 코드 Push (team3-matnani-app)
      ↓
2. GitHub Actions
   ├─ 테스트 / 빌드
   ├─ Docker 이미지 빌드 → ECR 푸시
   └─ config repo kustomization.yaml 이미지 태그 업데이트
      ↓
3. ArgoCD (App of Apps 패턴)
   ├─ main 브랜치 변경 감지 (polling)
   ├─ Kustomize 렌더링 (overlays/dev or prod)
   └─ EKS 자동 배포 (selfHeal: true)
      ↓
4. 배포 완료
   └─ Prometheus / Grafana / Alertmanager 모니터링
         └─ 알람 발생 시 Slack 채널 알림
```

**시크릿 관리**: AWS SSM Parameter Store → ESO (External Secrets Operator) → Kubernetes Secret

<br>

<hr style="border: 2px solid #000;">

## ▶️ 로컬 실행 방법

### 0. 사전 준비

- Java 17
- Node.js 18+
- MySQL 8 (스키마명: `matnani`)
- Redis

<br>

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
./mvnw spring-boot:run
```

기본 포트: `http://localhost:8080`  
최초 실행 시 `data.sql`의 지역 데이터가 자동으로 삽입됩니다.

<br>

### Frontend

```bash
cd frontend
npm install
npm run dev
```

기본 주소: `http://127.0.0.1:5174`


<br>

<hr style="border: 2px solid #000;">

## 📡 API 목록

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

<br>
<br>

<hr style="border: 2px solid #000;">


## 🌿 브랜치 전략

### 브랜치 구조

| 브랜치 | 설명 |
|--------|------|
| `main` | 프로덕션 배포 기준 브랜치. PR을 통해서만 병합 가능 |
| `feature/{이름}/{기능}` | 기능 개발 브랜치 (예: `feature/yueun/cicd-prod`) |
| `fix/{이름}/{기능}` | 버그 수정 브랜치 (예: `fix/yueun/argocd-redis-tls`) |
