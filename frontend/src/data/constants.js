export const categories = ["전체", "농수산물", "베이커리", "가공식품", "기타"];

export const neighborhoods = ["성수동", "연남동", "망원동", "합정동", "잠실동"];

export const regionOptions = [
  { city: "서울", district: "성동구", dong: "성수동" },
  { city: "서울", district: "마포구", dong: "연남동" },
  { city: "서울", district: "마포구", dong: "망원동" },
  { city: "서울", district: "마포구", dong: "합정동" },
  { city: "서울", district: "송파구", dong: "잠실동" },
  { city: "서울", district: "강남구", dong: "역삼동" },
  { city: "서울", district: "강남구", dong: "논현동" },
  { city: "서울", district: "서초구", dong: "서초동" },
  { city: "서울", district: "용산구", dong: "한남동" },
  { city: "서울", district: "종로구", dong: "혜화동" },
  { city: "경기", district: "수원시 영통구", dong: "광교동" },
  { city: "경기", district: "성남시 분당구", dong: "정자동" },
  { city: "부산", district: "해운대구", dong: "우동" },
  { city: "대구", district: "중구", dong: "동성로동" },
  { city: "광주", district: "서구", dong: "상무동" },
].map((region) => ({
  ...region,
  label: `${region.city} ${region.district} ${region.dong}`,
}));

export const productStatuses = ["전체", "판매중", "예약중", "판매완료"];

export const sortOptions = [
  { value: "latest", label: "최신순" },
  { value: "near_expiry", label: "마감임박순" },
  { value: "discount_high", label: "할인율 높은순" },
  { value: "price_low", label: "낮은 가격순" },
  { value: "price_high", label: "높은 가격순" },
  { value: "review_count", label: "리뷰 많은순" },
  { value: "rating_high", label: "리뷰 좋은순" },
];

export const TEST_ACCOUNT = {
  email: "user@test.com",
  password: "1234",
  nickname: "맛난이회원",
  region: "성수동",
};
