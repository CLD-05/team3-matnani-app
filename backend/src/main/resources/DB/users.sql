USE matnani;

-- 유저 (판매자 10명 + 일반 구매자 3명)
-- password: password BCrypt 해시
-- ============================================================
INSERT INTO users (email, password_hash, nickname, phone, role, region_id) VALUES
                                                                               ('yeonnam@bakery.com',   '$2a$12$rmagPRUmuRe8rtMAT2/Ciu/GgSP1jCPE.SMJbU/0.RLrXP4Fn2rlK', '연남 베이커리',   '010-1111-0001', 'BUSINESS', 5),
                                                                               ('seongsu@bakeshop.com', '$2a$12$rmagPRUmuRe8rtMAT2/Ciu/GgSP1jCPE.SMJbU/0.RLrXP4Fn2rlK', '성수 베이크샵',   '010-1111-0002', 'BUSINESS', 8),
                                                                               ('mangwon@bread.com',    '$2a$12$rmagPRUmuRe8rtMAT2/Ciu/GgSP1jCPE.SMJbU/0.RLrXP4Fn2rlK', '망원 빵집',       '010-1111-0003', 'BUSINESS', 6),
                                                                               ('hapjeong@bakery.com',  '$2a$12$rmagPRUmuRe8rtMAT2/Ciu/GgSP1jCPE.SMJbU/0.RLrXP4Fn2rlK', '합정 베이커리',   '010-1111-0004', 'BUSINESS', 7),
                                                                               ('jamsil@store.com',     '$2a$12$rmagPRUmuRe8rtMAT2/Ciu/GgSP1jCPE.SMJbU/0.RLrXP4Fn2rlK', '잠실 편의점',     '010-1111-0005', 'BUSINESS', 9),
                                                                               ('seongsu@greenbake.com','$2a$12$rmagPRUmuRe8rtMAT2/Ciu/GgSP1jCPE.SMJbU/0.RLrXP4Fn2rlK', '성수 그린베이크', '010-1111-0006', 'BUSINESS', 8),
                                                                               ('yeonnam@sandwich.com', '$2a$12$rmagPRUmuRe8rtMAT2/Ciu/GgSP1jCPE.SMJbU/0.RLrXP4Fn2rlK', '연남 샌드위치샵', '010-1111-0007', 'BUSINESS', 5),
                                                                               ('mangwon@cake.com',     '$2a$12$rmagPRUmuRe8rtMAT2/Ciu/GgSP1jCPE.SMJbU/0.RLrXP4Fn2rlK', '망원 케이크샵',   '010-1111-0008', 'BUSINESS', 6),
                                                                               ('matnani@user.com',     '$2a$12$rmagPRUmuRe8rtMAT2/Ciu/GgSP1jCPE.SMJbU/0.RLrXP4Fn2rlK', '맛난이회원',     '010-1111-0009', 'NORMAL',   8),
                                                                               ('sallet@store.com',     '$2a$12$rmagPRUmuRe8rtMAT2/Ciu/GgSP1jCPE.SMJbU/0.RLrXP4Fn2rlK', '샐럿',           '010-1111-0010', 'BUSINESS', 8),
                                                                               ('seongsu@bakery2.com',  '$2a$12$rmagPRUmuRe8rtMAT2/Ciu/GgSP1jCPE.SMJbU/0.RLrXP4Fn2rlK', '베이커리샵',     '010-1111-0011', 'BUSINESS', 8),
                                                                               ('buyer1@test.com',      '$2a$12$rmagPRUmuRe8rtMAT2/Ciu/GgSP1jCPE.SMJbU/0.RLrXP4Fn2rlK', '구매자1',        '010-2222-0001', 'NORMAL',   8),
                                                                               ('buyer2@test.com',      '$2a$12$rmagPRUmuRe8rtMAT2/Ciu/GgSP1jCPE.SMJbU/0.RLrXP4Fn2rlK', '구매자2',        '010-2222-0002', 'NORMAL',   5),
                                                                               ('buyer3@test.com',      '$2a$12$rmagPRUmuRe8rtMAT2/Ciu/GgSP1jCPE.SMJbU/0.RLrXP4Fn2rlK', '구매자3',        '010-2222-0003', 'NORMAL',   6);


-- 사업자 프로필 (BUSINESS 유저만)
-- ============================================================
INSERT INTO business_profiles (user_id, business_number, business_name, owner_name, verify_status, verified_at) VALUES
                                                                                                                    (1,  '123-45-00001', '연남베이커리',   'aaa', 'VERIFIED', NOW()),
                                                                                                                    (2,  '123-45-00002', '성수베이크샵',   'bbb', 'VERIFIED', NOW()),
                                                                                                                    (3,  '123-45-00003', '망원빵집',       'ccc', 'VERIFIED', NOW()),
                                                                                                                    (4,  '123-45-00004', '합정베이커리',   'ddd', 'VERIFIED', NOW()),
                                                                                                                    (5,  '123-45-00005', '잠실편의점',     'eee', 'VERIFIED', NOW()),
                                                                                                                    (6,  '123-45-00006', '성수그린베이크', 'fff',   'VERIFIED', NOW()),
                                                                                                                    (7,  '123-45-00007', '연남샌드위치샵', 'ggg', 'VERIFIED', NOW()),
                                                                                                                    (8,  '123-45-00008', '망원케이크샵',   'hhh','VERIFIED', NOW()),
                                                                                                                    (10, '123-45-00010', '샐럿',           'iii','VERIFIED', NOW()),
                                                                                                                    (11, '123-45-00011', '베이커리샵',     'jjj', 'VERIFIED', NOW());


