-- 상품 데이터
-- ============================================================
-- 컬럼 순서: seller_id, region_id, title, description, category, defect_reason,
--            original_price, discount_price, discount_rate, status,
--            pickup_place, pickup_start_at, pickup_end_at, expires_at,
--            total_quantity, remaining_quantity, per_person_limit,
--            time_sale, timed_discount_rate1, timed_discount_rate2
INSERT INTO products (seller_id, region_id, title, description, category, defect_reason, original_price, discount_price, discount_rate, status, pickup_place, pickup_start_at, pickup_end_at, expires_at, total_quantity, remaining_quantity, per_person_limit, time_sale, timed_discount_rate1, timed_discount_rate2) VALUES
-- id=1  마카롱 (성수동)
(1,  1866,'금이 간 마카롱',        '모양은 금이 갔지만 맛은 그대로예요!',        'BAKERY_DESSERT',  'SHAPE_BAD',   3200, 1920,  40.00, 'ON_SALE',  '성수동 베이커리 앞',   NOW(), '2026-07-10 23:59:59', '2026-07-10 23:59:59', 20, 20,  20, 1, 0, 0),
-- id=2  마들렌 (성수동)
(2,  1866,'찌그러진 마들렌',       '모양만 찌그러졌을 뿐 맛은 최고예요!',        'BAKERY_DESSERT',  'SHAPE_BAD',   2500,  1750,  30.00, 'ON_SALE',  '성수동 베이크샵 앞',   NOW(), '2026-07-10 23:59:59', '2026-07-10 23:59:59', 20,  20,  5, 1, 0, 0),
-- id=3  소금빵 (성수동)
(3,  1866,'마감 기한 임박 소금빵', '소비 기한이 오늘 저녁까지예요!',             'BAKERY_DESSERT',  'NEAR_EXPIRY', 3000, 1500,  50.00, 'ON_SALE',  '성수동 빵집 앞',       NOW(), '2026-07-10 23:59:59', '2026-07-10 23:59:59', 30,  30,  30, 0, 0, 0),
-- id=4  피자빵 (성수동)
(4,  1866,'토핑이 쏠린 피자빵',    '토핑이 한쪽으로 쏠렸어요ㅠㅠ',              'BAKERY_DESSERT',  'SHAPE_BAD',   4000,  2600,  35.00, 'ON_SALE',  '성수동 베이커리 앞',   NOW(), '2026-07-10 23:59:59', '2026-07-10 23:59:59', 5,  5,  1, 0, 0, 0),
-- id=5  도시락 (성수동)
(5,  1866,'소비기한 오늘까지 도시락', '오늘 소비기한이지만 신선해요!',            'PROCESSED_FOOD',  'NEAR_EXPIRY', 8500,  3400,  60.00, 'ON_SALE',  '성수동 편의점 앞',     NOW(), '2026-07-10 23:59:59', '2026-07-10 23:59:59', 5,  5,  1, 1, 0, 10),
-- id=6  슈크림빵 (성수동)
(6,  1866,'크림이 터진 슈크림빵',  '크림이 조금 터졌지만 맛은 똑같습니다.',      'BAKERY_DESSERT',  'SHAPE_BAD',   2000,  1000,  50.00, 'ON_SALE',  '성수동 그린베이크 앞', NOW(), '2026-07-10 23:59:59', '2026-07-10 23:59:59', 10,  10,  10, 1, 0, 0),
-- id=7  샌드위치 (성수동)
(7,  1866,'재고 남은 샌드위치',    '오늘 샌드위치를 너무 많이 만들었어요ㅜㅜ',   'BAKERY_DESSERT',  'ETC',         4500,  2700,  40.00, 'ON_SALE',  '성수동 샌드위치샵 앞', NOW(), '2026-07-10 23:59:59', '2026-07-10 23:59:59', 20,  20,  20, 1, 0, 0),
-- id=8  케이크 (성수동)
(8,  1866,'찌그러진 케이크',       '모양만 찌그러졌어요. 맛은 보장!',            'BAKERY_DESSERT',  'SHAPE_BAD',   12000, 7200,  40.00, 'ON_SALE',  '성수동 케이크샵 앞',   NOW(), '2026-07-10 23:59:59', '2026-07-10 23:59:59', 3,  3,  1, 0, 0, 10),
-- id=9  사과 5개 (성수동)
(9,  1866,'못난이 사과 1kg',           '흠집이 있지만 맛은 달콤해요.',               'PRODUCE_SEAFOOD', 'SCRATCH',     10000, 7000,  30.00, 'ON_SALE',  '성수동 직거래',        NOW(), '2026-07-10 23:59:59', '2026-07-10 23:59:59', 7,  7,  7, 1, 0, 10),
-- id=10 당근 1kg (성수동)
(10, 1866,'다리 여러 개 달린 당근 1kg','모양은 특이하지만 맛은 똑같아요!',          'PRODUCE_SEAFOOD', 'SHAPE_BAD',   4500,  3000,  33.33, 'ON_SALE',  '성수동 직거래',        NOW(), '2026-07-10 23:59:59', '2026-07-10 23:59:59', 10,  10,  5, 0, 0, 0),
-- id=11 샐러드 (성수동)
(11, 1866,'소비기한 오늘까지 샐러드', '오늘까지만 판매해요!',                      'PROCESSED_FOOD',  'NEAR_EXPIRY', 6500,  3575,  45.00, 'ON_SALE',  '성수동 샐럿 앞',       NOW(), '2026-07-10 23:59:59', '2026-07-10 23:59:59', 10,  10,  10, 1, 0, 0),
-- id=12 식빵 1봉 (성수동)
(12, 1866,'눌린 식빵',               '모양이 조금 눌렸어요!',                     'BAKERY_DESSERT',  'SHAPE_BAD',   4500,  3150,  30.00, 'ON_SALE',  '성수동 베이커리샵 앞', NOW(), '2026-07-10 23:59:59', '2026-07-10 23:59:59', 10,  10,  2, 1, 0, 0);


-- 상품 이미지
-- ============================================================
INSERT INTO product_images (product_id, image_url, sort_order) VALUES
                                                                   (1,  'https://team3-matnani-prod-images.s3.ap-northeast-2.amazonaws.com/macaron.png',    1),
                                                                   (2,  'https://team3-matnani-prod-images.s3.ap-northeast-2.amazonaws.com/madlen.png',     1),
                                                                   (3,  'https://team3-matnani-prod-images.s3.ap-northeast-2.amazonaws.com/saltbread.jpg',  1),
                                                                   (4,  'https://team3-matnani-prod-images.s3.ap-northeast-2.amazonaws.com/pizzabread.png', 1),
                                                                   (5,  'https://team3-matnani-prod-images.s3.ap-northeast-2.amazonaws.com/rice.png',       1),
                                                                   (6,  'https://team3-matnani-prod-images.s3.ap-northeast-2.amazonaws.com/creambread.png', 1),
                                                                   (7,  'https://team3-matnani-prod-images.s3.ap-northeast-2.amazonaws.com/sandwich.jpg',   1),
                                                                   (8,  'https://team3-matnani-prod-images.s3.ap-northeast-2.amazonaws.com/cake.jpg',       1),
                                                                   (9,  'https://team3-matnani-prod-images.s3.ap-northeast-2.amazonaws.com/apple.jpg',      1),
                                                                   (10, 'https://team3-matnani-prod-images.s3.ap-northeast-2.amazonaws.com/carrot.jpg',     1),
                                                                   (11, 'https://team3-matnani-prod-images.s3.ap-northeast-2.amazonaws.com/salad.jpg',      1),
                                                                   (12, 'https://team3-matnani-prod-images.s3.ap-northeast-2.amazonaws.com/whitebread.png', 1);

-- 비밀 댓글 (product_id 채움 → 판매자에게 COMMENT 알림)
-- ============================================================
INSERT INTO secret_comments (product_id, writer_id, content) VALUES
                                                                 (1,  12, '혹시 오늘 저녁에도 픽업 가능한가요?'),
                                                                 (1,  13, '마카롱 냉동 보관 가능한가요?'),
                                                                 (2,  12, '마들렌 글루텐프리 버전도 있나요?'),
                                                                 (3,  14, '소금빵 추가 구매 가능한가요?'),
                                                                 (6,  12, '슈크림빵 알러지 성분 알 수 있을까요?'),
                                                                 (9,  13, '사과 품종이 어떻게 되나요?');


-- 비밀 댓글 알림 (판매자에게 COMMENT 알림)
-- ============================================================
INSERT INTO notifications (user_id, type, product_id, reservation_id, is_read) VALUES
                                                                                   (1,  'COMMENT', 1,  NULL, false),
                                                                                   (1,  'COMMENT', 1,  NULL, true),
                                                                                   (2,  'COMMENT', 2,  NULL, false),
                                                                                   (3,  'COMMENT', 3,  NULL, false),
                                                                                   (6,  'COMMENT', 6,  NULL, false),
                                                                                   (9,  'COMMENT', 9,  NULL, true);