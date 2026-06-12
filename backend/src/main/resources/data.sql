-- 맛난이 지역 초기 데이터
-- CITY (시/도)
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1,  '서울특별시',     'CITY', NULL, NOW()),
                                                                       (2,  '부산광역시',     'CITY', NULL, NOW()),
                                                                       (3,  '대구광역시',     'CITY', NULL, NOW()),
                                                                       (4,  '인천광역시',     'CITY', NULL, NOW()),
                                                                       (5,  '광주광역시',     'CITY', NULL, NOW()),
                                                                       (6,  '대전광역시',     'CITY', NULL, NOW()),
                                                                       (7,  '울산광역시',     'CITY', NULL, NOW()),
                                                                       (8,  '세종특별자치시', 'CITY', NULL, NOW()),
                                                                       (9,  '경기도',         'CITY', NULL, NOW()),
                                                                       (10, '강원특별자치도', 'CITY', NULL, NOW()),
                                                                       (11, '충청북도',       'CITY', NULL, NOW()),
                                                                       (12, '충청남도',       'CITY', NULL, NOW()),
                                                                       (13, '전북특별자치도', 'CITY', NULL, NOW()),
                                                                       (14, '전라남도',       'CITY', NULL, NOW()),
                                                                       (15, '경상북도',       'CITY', NULL, NOW()),
                                                                       (16, '경상남도',       'CITY', NULL, NOW()),
                                                                       (17, '제주특별자치도', 'CITY', NULL, NOW());

-- DISTRICT (구/시/군)
-- 서울특별시
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (101, '종로구',   'DISTRICT', 1, NOW()),
                                                                       (102, '중구',     'DISTRICT', 1, NOW()),
                                                                       (103, '용산구',   'DISTRICT', 1, NOW()),
                                                                       (104, '성동구',   'DISTRICT', 1, NOW()),
                                                                       (105, '광진구',   'DISTRICT', 1, NOW()),
                                                                       (106, '동대문구', 'DISTRICT', 1, NOW()),
                                                                       (107, '중랑구',   'DISTRICT', 1, NOW()),
                                                                       (108, '성북구',   'DISTRICT', 1, NOW()),
                                                                       (109, '강북구',   'DISTRICT', 1, NOW()),
                                                                       (110, '도봉구',   'DISTRICT', 1, NOW()),
                                                                       (111, '노원구',   'DISTRICT', 1, NOW()),
                                                                       (112, '은평구',   'DISTRICT', 1, NOW()),
                                                                       (113, '서대문구', 'DISTRICT', 1, NOW()),
                                                                       (114, '마포구',   'DISTRICT', 1, NOW()),
                                                                       (115, '양천구',   'DISTRICT', 1, NOW()),
                                                                       (116, '강서구',   'DISTRICT', 1, NOW()),
                                                                       (117, '구로구',   'DISTRICT', 1, NOW()),
                                                                       (118, '금천구',   'DISTRICT', 1, NOW()),
                                                                       (119, '영등포구', 'DISTRICT', 1, NOW()),
                                                                       (120, '동작구',   'DISTRICT', 1, NOW()),
                                                                       (121, '관악구',   'DISTRICT', 1, NOW()),
                                                                       (122, '서초구',   'DISTRICT', 1, NOW()),
                                                                       (123, '강남구',   'DISTRICT', 1, NOW()),
                                                                       (124, '송파구',   'DISTRICT', 1, NOW()),
                                                                       (125, '강동구',   'DISTRICT', 1, NOW());

-- 부산광역시
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (131, '중구',     'DISTRICT', 2, NOW()),
                                                                       (132, '서구',     'DISTRICT', 2, NOW()),
                                                                       (133, '동구',     'DISTRICT', 2, NOW()),
                                                                       (134, '영도구',   'DISTRICT', 2, NOW()),
                                                                       (135, '부산진구', 'DISTRICT', 2, NOW()),
                                                                       (136, '동래구',   'DISTRICT', 2, NOW()),
                                                                       (137, '남구',     'DISTRICT', 2, NOW()),
                                                                       (138, '북구',     'DISTRICT', 2, NOW()),
                                                                       (139, '해운대구', 'DISTRICT', 2, NOW()),
                                                                       (140, '사하구',   'DISTRICT', 2, NOW()),
                                                                       (141, '금정구',   'DISTRICT', 2, NOW()),
                                                                       (142, '강서구',   'DISTRICT', 2, NOW()),
                                                                       (143, '연제구',   'DISTRICT', 2, NOW()),
                                                                       (144, '수영구',   'DISTRICT', 2, NOW()),
                                                                       (145, '사상구',   'DISTRICT', 2, NOW()),
                                                                       (146, '기장군',   'DISTRICT', 2, NOW());

-- 대구광역시
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (151, '중구',   'DISTRICT', 3, NOW()),
                                                                       (152, '동구',   'DISTRICT', 3, NOW()),
                                                                       (153, '서구',   'DISTRICT', 3, NOW()),
                                                                       (154, '남구',   'DISTRICT', 3, NOW()),
                                                                       (155, '북구',   'DISTRICT', 3, NOW()),
                                                                       (156, '수성구', 'DISTRICT', 3, NOW()),
                                                                       (157, '달서구', 'DISTRICT', 3, NOW()),
                                                                       (158, '달성군', 'DISTRICT', 3, NOW());

-- 인천광역시
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (161, '중구',     'DISTRICT', 4, NOW()),
                                                                       (162, '동구',     'DISTRICT', 4, NOW()),
                                                                       (163, '미추홀구', 'DISTRICT', 4, NOW()),
                                                                       (164, '연수구',   'DISTRICT', 4, NOW()),
                                                                       (165, '남동구',   'DISTRICT', 4, NOW()),
                                                                       (166, '부평구',   'DISTRICT', 4, NOW()),
                                                                       (167, '계양구',   'DISTRICT', 4, NOW()),
                                                                       (168, '서구',     'DISTRICT', 4, NOW()),
                                                                       (169, '강화군',   'DISTRICT', 4, NOW()),
                                                                       (170, '옹진군',   'DISTRICT', 4, NOW());

-- 광주광역시
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (171, '동구',   'DISTRICT', 5, NOW()),
                                                                       (172, '서구',   'DISTRICT', 5, NOW()),
                                                                       (173, '남구',   'DISTRICT', 5, NOW()),
                                                                       (174, '북구',   'DISTRICT', 5, NOW()),
                                                                       (175, '광산구', 'DISTRICT', 5, NOW());

-- 대전광역시
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (181, '동구',   'DISTRICT', 6, NOW()),
                                                                       (182, '중구',   'DISTRICT', 6, NOW()),
                                                                       (183, '서구',   'DISTRICT', 6, NOW()),
                                                                       (184, '유성구', 'DISTRICT', 6, NOW()),
                                                                       (185, '대덕구', 'DISTRICT', 6, NOW());

-- 울산광역시
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (191, '중구',   'DISTRICT', 7, NOW()),
                                                                       (192, '남구',   'DISTRICT', 7, NOW()),
                                                                       (193, '동구',   'DISTRICT', 7, NOW()),
                                                                       (194, '북구',   'DISTRICT', 7, NOW()),
                                                                       (195, '울주군', 'DISTRICT', 7, NOW());

-- 세종특별자치시 (구 없이 바로 동)
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
    (196, '세종시', 'DISTRICT', 8, NOW());

-- 경기도
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (201, '수원시',   'DISTRICT', 9, NOW()),
                                                                       (202, '성남시',   'DISTRICT', 9, NOW()),
                                                                       (203, '의정부시', 'DISTRICT', 9, NOW()),
                                                                       (204, '안양시',   'DISTRICT', 9, NOW()),
                                                                       (205, '부천시',   'DISTRICT', 9, NOW()),
                                                                       (206, '광명시',   'DISTRICT', 9, NOW()),
                                                                       (207, '평택시',   'DISTRICT', 9, NOW()),
                                                                       (208, '동두천시', 'DISTRICT', 9, NOW()),
                                                                       (209, '안산시',   'DISTRICT', 9, NOW()),
                                                                       (210, '고양시',   'DISTRICT', 9, NOW()),
                                                                       (211, '과천시',   'DISTRICT', 9, NOW()),
                                                                       (212, '구리시',   'DISTRICT', 9, NOW()),
                                                                       (213, '남양주시', 'DISTRICT', 9, NOW()),
                                                                       (214, '오산시',   'DISTRICT', 9, NOW()),
                                                                       (215, '시흥시',   'DISTRICT', 9, NOW()),
                                                                       (216, '군포시',   'DISTRICT', 9, NOW()),
                                                                       (217, '의왕시',   'DISTRICT', 9, NOW()),
                                                                       (218, '하남시',   'DISTRICT', 9, NOW()),
                                                                       (219, '용인시',   'DISTRICT', 9, NOW()),
                                                                       (220, '파주시',   'DISTRICT', 9, NOW()),
                                                                       (221, '이천시',   'DISTRICT', 9, NOW()),
                                                                       (222, '안성시',   'DISTRICT', 9, NOW()),
                                                                       (223, '김포시',   'DISTRICT', 9, NOW()),
                                                                       (224, '화성시',   'DISTRICT', 9, NOW()),
                                                                       (225, '광주시',   'DISTRICT', 9, NOW()),
                                                                       (226, '양주시',   'DISTRICT', 9, NOW()),
                                                                       (227, '포천시',   'DISTRICT', 9, NOW()),
                                                                       (228, '여주시',   'DISTRICT', 9, NOW()),
                                                                       (229, '연천군',   'DISTRICT', 9, NOW()),
                                                                       (230, '가평군',   'DISTRICT', 9, NOW()),
                                                                       (231, '양평군',   'DISTRICT', 9, NOW());

-- 강원특별자치도
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (241, '춘천시', 'DISTRICT', 10, NOW()),
                                                                       (242, '원주시', 'DISTRICT', 10, NOW()),
                                                                       (243, '강릉시', 'DISTRICT', 10, NOW()),
                                                                       (244, '동해시', 'DISTRICT', 10, NOW()),
                                                                       (245, '태백시', 'DISTRICT', 10, NOW()),
                                                                       (246, '속초시', 'DISTRICT', 10, NOW()),
                                                                       (247, '삼척시', 'DISTRICT', 10, NOW()),
                                                                       (248, '홍천군', 'DISTRICT', 10, NOW()),
                                                                       (249, '횡성군', 'DISTRICT', 10, NOW()),
                                                                       (250, '영월군', 'DISTRICT', 10, NOW()),
                                                                       (251, '평창군', 'DISTRICT', 10, NOW()),
                                                                       (252, '정선군', 'DISTRICT', 10, NOW()),
                                                                       (253, '철원군', 'DISTRICT', 10, NOW()),
                                                                       (254, '화천군', 'DISTRICT', 10, NOW()),
                                                                       (255, '양구군', 'DISTRICT', 10, NOW()),
                                                                       (256, '인제군', 'DISTRICT', 10, NOW()),
                                                                       (257, '고성군', 'DISTRICT', 10, NOW()),
                                                                       (258, '양양군', 'DISTRICT', 10, NOW());

-- 충청북도
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (261, '청주시', 'DISTRICT', 11, NOW()),
                                                                       (262, '충주시', 'DISTRICT', 11, NOW()),
                                                                       (263, '제천시', 'DISTRICT', 11, NOW()),
                                                                       (264, '보은군', 'DISTRICT', 11, NOW()),
                                                                       (265, '옥천군', 'DISTRICT', 11, NOW()),
                                                                       (266, '영동군', 'DISTRICT', 11, NOW()),
                                                                       (267, '증평군', 'DISTRICT', 11, NOW()),
                                                                       (268, '진천군', 'DISTRICT', 11, NOW()),
                                                                       (269, '괴산군', 'DISTRICT', 11, NOW()),
                                                                       (270, '음성군', 'DISTRICT', 11, NOW()),
                                                                       (271, '단양군', 'DISTRICT', 11, NOW());

-- 충청남도
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (281, '천안시', 'DISTRICT', 12, NOW()),
                                                                       (282, '공주시', 'DISTRICT', 12, NOW()),
                                                                       (283, '보령시', 'DISTRICT', 12, NOW()),
                                                                       (284, '아산시', 'DISTRICT', 12, NOW()),
                                                                       (285, '서산시', 'DISTRICT', 12, NOW()),
                                                                       (286, '논산시', 'DISTRICT', 12, NOW()),
                                                                       (287, '계룡시', 'DISTRICT', 12, NOW()),
                                                                       (288, '당진시', 'DISTRICT', 12, NOW()),
                                                                       (289, '금산군', 'DISTRICT', 12, NOW()),
                                                                       (290, '부여군', 'DISTRICT', 12, NOW()),
                                                                       (291, '서천군', 'DISTRICT', 12, NOW()),
                                                                       (292, '청양군', 'DISTRICT', 12, NOW()),
                                                                       (293, '홍성군', 'DISTRICT', 12, NOW()),
                                                                       (294, '예산군', 'DISTRICT', 12, NOW()),
                                                                       (295, '태안군', 'DISTRICT', 12, NOW());

-- 전북특별자치도
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (301, '전주시', 'DISTRICT', 13, NOW()),
                                                                       (302, '군산시', 'DISTRICT', 13, NOW()),
                                                                       (303, '익산시', 'DISTRICT', 13, NOW()),
                                                                       (304, '정읍시', 'DISTRICT', 13, NOW()),
                                                                       (305, '남원시', 'DISTRICT', 13, NOW()),
                                                                       (306, '김제시', 'DISTRICT', 13, NOW()),
                                                                       (307, '완주군', 'DISTRICT', 13, NOW()),
                                                                       (308, '진안군', 'DISTRICT', 13, NOW()),
                                                                       (309, '무주군', 'DISTRICT', 13, NOW()),
                                                                       (310, '장수군', 'DISTRICT', 13, NOW()),
                                                                       (311, '임실군', 'DISTRICT', 13, NOW()),
                                                                       (312, '순창군', 'DISTRICT', 13, NOW()),
                                                                       (313, '고창군', 'DISTRICT', 13, NOW()),
                                                                       (314, '부안군', 'DISTRICT', 13, NOW());

-- 전라남도
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (321, '목포시', 'DISTRICT', 14, NOW()),
                                                                       (322, '여수시', 'DISTRICT', 14, NOW()),
                                                                       (323, '순천시', 'DISTRICT', 14, NOW()),
                                                                       (324, '나주시', 'DISTRICT', 14, NOW()),
                                                                       (325, '광양시', 'DISTRICT', 14, NOW()),
                                                                       (326, '담양군', 'DISTRICT', 14, NOW()),
                                                                       (327, '곡성군', 'DISTRICT', 14, NOW()),
                                                                       (328, '구례군', 'DISTRICT', 14, NOW()),
                                                                       (329, '고흥군', 'DISTRICT', 14, NOW()),
                                                                       (330, '보성군', 'DISTRICT', 14, NOW()),
                                                                       (331, '화순군', 'DISTRICT', 14, NOW()),
                                                                       (332, '장흥군', 'DISTRICT', 14, NOW()),
                                                                       (333, '강진군', 'DISTRICT', 14, NOW()),
                                                                       (334, '해남군', 'DISTRICT', 14, NOW()),
                                                                       (335, '영암군', 'DISTRICT', 14, NOW()),
                                                                       (336, '무안군', 'DISTRICT', 14, NOW()),
                                                                       (337, '함평군', 'DISTRICT', 14, NOW()),
                                                                       (338, '영광군', 'DISTRICT', 14, NOW()),
                                                                       (339, '장성군', 'DISTRICT', 14, NOW()),
                                                                       (340, '완도군', 'DISTRICT', 14, NOW()),
                                                                       (341, '진도군', 'DISTRICT', 14, NOW()),
                                                                       (342, '신안군', 'DISTRICT', 14, NOW());

-- 경상북도
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (351, '포항시', 'DISTRICT', 15, NOW()),
                                                                       (352, '경주시', 'DISTRICT', 15, NOW()),
                                                                       (353, '김천시', 'DISTRICT', 15, NOW()),
                                                                       (354, '안동시', 'DISTRICT', 15, NOW()),
                                                                       (355, '구미시', 'DISTRICT', 15, NOW()),
                                                                       (356, '영주시', 'DISTRICT', 15, NOW()),
                                                                       (357, '영천시', 'DISTRICT', 15, NOW()),
                                                                       (358, '상주시', 'DISTRICT', 15, NOW()),
                                                                       (359, '문경시', 'DISTRICT', 15, NOW()),
                                                                       (360, '경산시', 'DISTRICT', 15, NOW()),
                                                                       (361, '의성군', 'DISTRICT', 15, NOW()),
                                                                       (362, '청송군', 'DISTRICT', 15, NOW()),
                                                                       (363, '영양군', 'DISTRICT', 15, NOW()),
                                                                       (364, '영덕군', 'DISTRICT', 15, NOW()),
                                                                       (365, '청도군', 'DISTRICT', 15, NOW()),
                                                                       (366, '고령군', 'DISTRICT', 15, NOW()),
                                                                       (367, '성주군', 'DISTRICT', 15, NOW()),
                                                                       (368, '칠곡군', 'DISTRICT', 15, NOW()),
                                                                       (369, '예천군', 'DISTRICT', 15, NOW()),
                                                                       (370, '봉화군', 'DISTRICT', 15, NOW()),
                                                                       (371, '울진군', 'DISTRICT', 15, NOW()),
                                                                       (372, '울릉군', 'DISTRICT', 15, NOW()),
                                                                       (373, '군위군', 'DISTRICT', 15, NOW());

-- 경상남도
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (381, '창원시', 'DISTRICT', 16, NOW()),
                                                                       (382, '진주시', 'DISTRICT', 16, NOW()),
                                                                       (383, '통영시', 'DISTRICT', 16, NOW()),
                                                                       (384, '사천시', 'DISTRICT', 16, NOW()),
                                                                       (385, '김해시', 'DISTRICT', 16, NOW()),
                                                                       (386, '밀양시', 'DISTRICT', 16, NOW()),
                                                                       (387, '거제시', 'DISTRICT', 16, NOW()),
                                                                       (388, '양산시', 'DISTRICT', 16, NOW()),
                                                                       (389, '의령군', 'DISTRICT', 16, NOW()),
                                                                       (390, '함안군', 'DISTRICT', 16, NOW()),
                                                                       (391, '창녕군', 'DISTRICT', 16, NOW()),
                                                                       (392, '고성군', 'DISTRICT', 16, NOW()),
                                                                       (393, '남해군', 'DISTRICT', 16, NOW()),
                                                                       (394, '하동군', 'DISTRICT', 16, NOW()),
                                                                       (395, '산청군', 'DISTRICT', 16, NOW()),
                                                                       (396, '함양군', 'DISTRICT', 16, NOW()),
                                                                       (397, '거창군', 'DISTRICT', 16, NOW()),
                                                                       (398, '합천군', 'DISTRICT', 16, NOW());

-- 제주특별자치도
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (401, '제주시',   'DISTRICT', 17, NOW()),
                                                                       (402, '서귀포시', 'DISTRICT', 17, NOW());

-- DONG (동/읍/면)
-- 서울 종로구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1001, '청운효자동', 'DONG', 101, NOW()),
                                                                       (1002, '사직동',     'DONG', 101, NOW()),
                                                                       (1003, '삼청동',     'DONG', 101, NOW()),
                                                                       (1004, '혜화동',     'DONG', 101, NOW()),
                                                                       (1005, '창신동',     'DONG', 101, NOW());

-- 서울 중구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1011, '소공동',   'DONG', 102, NOW()),
                                                                       (1012, '명동',     'DONG', 102, NOW()),
                                                                       (1013, '황학동',   'DONG', 102, NOW()),
                                                                       (1014, '신당동',   'DONG', 102, NOW()),
                                                                       (1015, '다산동',   'DONG', 102, NOW());

-- 서울 용산구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1021, '후암동',   'DONG', 103, NOW()),
                                                                       (1022, '이태원동', 'DONG', 103, NOW()),
                                                                       (1023, '한남동',   'DONG', 103, NOW()),
                                                                       (1024, '서빙고동', 'DONG', 103, NOW()),
                                                                       (1025, '용산2가동','DONG', 103, NOW());

-- 서울 성동구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1031, '왕십리도선동', 'DONG', 104, NOW()),
                                                                       (1032, '행당1동',      'DONG', 104, NOW()),
                                                                       (1033, '응봉동',       'DONG', 104, NOW()),
                                                                       (1034, '금호1가동',    'DONG', 104, NOW()),
                                                                       (1035, '성수1가1동',   'DONG', 104, NOW());

-- 서울 광진구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1041, '화양동', 'DONG', 105, NOW()),
                                                                       (1042, '군자동', 'DONG', 105, NOW()),
                                                                       (1043, '중곡1동','DONG', 105, NOW()),
                                                                       (1044, '능동',   'DONG', 105, NOW()),
                                                                       (1045, '광장동', 'DONG', 105, NOW());

-- 서울 동대문구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1051, '용신동',   'DONG', 106, NOW()),
                                                                       (1052, '제기동',   'DONG', 106, NOW()),
                                                                       (1053, '전농1동',  'DONG', 106, NOW()),
                                                                       (1054, '답십리1동','DONG', 106, NOW()),
                                                                       (1055, '장안1동',  'DONG', 106, NOW());

-- 서울 중랑구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1061, '면목본동', 'DONG', 107, NOW()),
                                                                       (1062, '상봉1동',  'DONG', 107, NOW()),
                                                                       (1063, '망우본동', 'DONG', 107, NOW()),
                                                                       (1064, '신내1동',  'DONG', 107, NOW()),
                                                                       (1065, '묵1동',    'DONG', 107, NOW());

-- 서울 성북구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1071, '성북동',   'DONG', 108, NOW()),
                                                                       (1072, '삼선동',   'DONG', 108, NOW()),
                                                                       (1073, '동선동',   'DONG', 108, NOW()),
                                                                       (1074, '길음1동',  'DONG', 108, NOW()),
                                                                       (1075, '정릉1동',  'DONG', 108, NOW());

-- 서울 강북구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1081, '번1동',   'DONG', 109, NOW()),
                                                                       (1082, '수유1동', 'DONG', 109, NOW()),
                                                                       (1083, '미아동',  'DONG', 109, NOW()),
                                                                       (1084, '인수동',  'DONG', 109, NOW()),
                                                                       (1085, '우이동',  'DONG', 109, NOW());

-- 서울 도봉구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1091, '쌍문1동', 'DONG', 110, NOW()),
                                                                       (1092, '방학1동', 'DONG', 110, NOW()),
                                                                       (1093, '창1동',   'DONG', 110, NOW()),
                                                                       (1094, '도봉1동', 'DONG', 110, NOW()),
                                                                       (1095, '창동',    'DONG', 110, NOW());

-- 서울 노원구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1101, '월계1동', 'DONG', 111, NOW()),
                                                                       (1102, '공릉1동', 'DONG', 111, NOW()),
                                                                       (1103, '하계1동', 'DONG', 111, NOW()),
                                                                       (1104, '중계본동', 'DONG', 111, NOW()),
                                                                       (1105, '상계1동', 'DONG', 111, NOW());

-- 서울 은평구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1111, '녹번동',   'DONG', 112, NOW()),
                                                                       (1112, '불광1동',  'DONG', 112, NOW()),
                                                                       (1113, '응암1동',  'DONG', 112, NOW()),
                                                                       (1114, '신사1동',  'DONG', 112, NOW()),
                                                                       (1115, '구산동',   'DONG', 112, NOW());

-- 서울 서대문구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1121, '천연동',   'DONG', 113, NOW()),
                                                                       (1122, '신촌동',   'DONG', 113, NOW()),
                                                                       (1123, '연희동',   'DONG', 113, NOW()),
                                                                       (1124, '홍제1동',  'DONG', 113, NOW()),
                                                                       (1125, '남가좌1동','DONG', 113, NOW());

-- 서울 마포구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1131, '공덕동',  'DONG', 114, NOW()),
                                                                       (1132, '합정동',  'DONG', 114, NOW()),
                                                                       (1133, '망원1동', 'DONG', 114, NOW()),
                                                                       (1134, '연남동',  'DONG', 114, NOW()),
                                                                       (1135, '상암동',  'DONG', 114, NOW());

-- 서울 양천구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1141, '목1동',   'DONG', 115, NOW()),
                                                                       (1142, '신정1동', 'DONG', 115, NOW()),
                                                                       (1143, '신월1동', 'DONG', 115, NOW()),
                                                                       (1144, '목4동',   'DONG', 115, NOW()),
                                                                       (1145, '신정7동', 'DONG', 115, NOW());

-- 서울 강서구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1151, '화곡1동', 'DONG', 116, NOW()),
                                                                       (1152, '우장산동','DONG', 116, NOW()),
                                                                       (1153, '발산1동', 'DONG', 116, NOW()),
                                                                       (1154, '등촌1동', 'DONG', 116, NOW()),
                                                                       (1155, '가양1동', 'DONG', 116, NOW());

-- 서울 구로구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1161, '구로1동', 'DONG', 117, NOW()),
                                                                       (1162, '고척1동', 'DONG', 117, NOW()),
                                                                       (1163, '개봉1동', 'DONG', 117, NOW()),
                                                                       (1164, '오류1동', 'DONG', 117, NOW()),
                                                                       (1165, '신도림동','DONG', 117, NOW());

-- 서울 금천구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1171, '가산동',   'DONG', 118, NOW()),
                                                                       (1172, '독산1동',  'DONG', 118, NOW()),
                                                                       (1173, '시흥1동',  'DONG', 118, NOW()),
                                                                       (1174, '독산3동',  'DONG', 118, NOW()),
                                                                       (1175, '시흥5동',  'DONG', 118, NOW());

-- 서울 영등포구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1181, '영등포동', 'DONG', 119, NOW()),
                                                                       (1182, '여의동',   'DONG', 119, NOW()),
                                                                       (1183, '당산1동',  'DONG', 119, NOW()),
                                                                       (1184, '신길1동',  'DONG', 119, NOW()),
                                                                       (1185, '대림1동',  'DONG', 119, NOW());

-- 서울 동작구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1191, '노량진1동','DONG', 120, NOW()),
                                                                       (1192, '상도1동',  'DONG', 120, NOW()),
                                                                       (1193, '흑석동',   'DONG', 120, NOW()),
                                                                       (1194, '사당1동',  'DONG', 120, NOW()),
                                                                       (1195, '신대방1동','DONG', 120, NOW());

-- 서울 관악구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1201, '봉천동',   'DONG', 121, NOW()),
                                                                       (1202, '신림동',   'DONG', 121, NOW()),
                                                                       (1203, '서원동',   'DONG', 121, NOW()),
                                                                       (1204, '청룡동',   'DONG', 121, NOW()),
                                                                       (1205, '은천동',   'DONG', 121, NOW());

-- 서울 서초구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1211, '서초1동',  'DONG', 122, NOW()),
                                                                       (1212, '잠원동',   'DONG', 122, NOW()),
                                                                       (1213, '반포1동',  'DONG', 122, NOW()),
                                                                       (1214, '방배1동',  'DONG', 122, NOW()),
                                                                       (1215, '양재1동',  'DONG', 122, NOW());

-- 서울 강남구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1221, '역삼1동',  'DONG', 123, NOW()),
                                                                       (1222, '삼성1동',  'DONG', 123, NOW()),
                                                                       (1223, '대치1동',  'DONG', 123, NOW()),
                                                                       (1224, '청담동',   'DONG', 123, NOW()),
                                                                       (1225, '압구정동', 'DONG', 123, NOW()),
                                                                       (1226, '논현1동',  'DONG', 123, NOW()),
                                                                       (1227, '신사동',   'DONG', 123, NOW()),
                                                                       (1228, '도곡1동',  'DONG', 123, NOW()),
                                                                       (1229, '개포1동',  'DONG', 123, NOW()),
                                                                       (1230, '수서동',   'DONG', 123, NOW());

-- 서울 송파구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1231, '잠실본동', 'DONG', 124, NOW()),
                                                                       (1232, '잠실1동',  'DONG', 124, NOW()),
                                                                       (1233, '방이1동',  'DONG', 124, NOW()),
                                                                       (1234, '문정1동',  'DONG', 124, NOW()),
                                                                       (1235, '가락1동',  'DONG', 124, NOW());

-- 서울 강동구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1241, '강일동',   'DONG', 125, NOW()),
                                                                       (1242, '상일동',   'DONG', 125, NOW()),
                                                                       (1243, '고덕1동',  'DONG', 125, NOW()),
                                                                       (1244, '암사1동',  'DONG', 125, NOW()),
                                                                       (1245, '천호1동',  'DONG', 125, NOW());

-- 부산 해운대구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1251, '우동',     'DONG', 139, NOW()),
                                                                       (1252, '중동',     'DONG', 139, NOW()),
                                                                       (1253, '좌동',     'DONG', 139, NOW()),
                                                                       (1254, '송정동',   'DONG', 139, NOW()),
                                                                       (1255, '재송1동',  'DONG', 139, NOW());

-- 부산 부산진구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1261, '부전1동',  'DONG', 135, NOW()),
                                                                       (1262, '서면',     'DONG', 135, NOW()),
                                                                       (1263, '전포1동',  'DONG', 135, NOW()),
                                                                       (1264, '양정동',   'DONG', 135, NOW()),
                                                                       (1265, '연지동',   'DONG', 135, NOW());

-- 부산 동래구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1271, '수안동',   'DONG', 136, NOW()),
                                                                       (1272, '온천1동',  'DONG', 136, NOW()),
                                                                       (1273, '명장1동',  'DONG', 136, NOW()),
                                                                       (1274, '안락1동',  'DONG', 136, NOW()),
                                                                       (1275, '사직1동',  'DONG', 136, NOW());

-- 부산 남구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1281, '대연1동',  'DONG', 137, NOW()),
                                                                       (1282, '용호1동',  'DONG', 137, NOW()),
                                                                       (1283, '문현1동',  'DONG', 137, NOW()),
                                                                       (1284, '우암동',   'DONG', 137, NOW()),
                                                                       (1285, '감만1동',  'DONG', 137, NOW());

-- 대구 수성구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1291, '수성1가동','DONG', 156, NOW()),
                                                                       (1292, '만촌1동',  'DONG', 156, NOW()),
                                                                       (1293, '범어1동',  'DONG', 156, NOW()),
                                                                       (1294, '황금1동',  'DONG', 156, NOW()),
                                                                       (1295, '파동',     'DONG', 156, NOW());

-- 대구 달서구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1301, '용산1동',  'DONG', 157, NOW()),
                                                                       (1302, '죽전동',   'DONG', 157, NOW()),
                                                                       (1303, '월성1동',  'DONG', 157, NOW()),
                                                                       (1304, '송현1동',  'DONG', 157, NOW()),
                                                                       (1305, '상인1동',  'DONG', 157, NOW());

-- 인천 연수구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1311, '연수1동',  'DONG', 164, NOW()),
                                                                       (1312, '청학동',   'DONG', 164, NOW()),
                                                                       (1313, '동춘1동',  'DONG', 164, NOW()),
                                                                       (1314, '옥련1동',  'DONG', 164, NOW()),
                                                                       (1315, '송도1동',  'DONG', 164, NOW());

-- 인천 부평구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1321, '부평1동',  'DONG', 166, NOW()),
                                                                       (1322, '십정1동',  'DONG', 166, NOW()),
                                                                       (1323, '산곡1동',  'DONG', 166, NOW()),
                                                                       (1324, '갈산1동',  'DONG', 166, NOW()),
                                                                       (1325, '삼산1동',  'DONG', 166, NOW());

-- 광주 광산구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1331, '송정1동',  'DONG', 175, NOW()),
                                                                       (1332, '월곡1동',  'DONG', 175, NOW()),
                                                                       (1333, '운남동',   'DONG', 175, NOW()),
                                                                       (1334, '첨단1동',  'DONG', 175, NOW()),
                                                                       (1335, '수완동',   'DONG', 175, NOW());

-- 광주 북구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1341, '중흥1동',  'DONG', 174, NOW()),
                                                                       (1342, '용봉동',   'DONG', 174, NOW()),
                                                                       (1343, '일곡동',   'DONG', 174, NOW()),
                                                                       (1344, '신안동',   'DONG', 174, NOW()),
                                                                       (1345, '두암1동',  'DONG', 174, NOW());

-- 대전 유성구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1351, '노은1동',  'DONG', 184, NOW()),
                                                                       (1352, '노은2동',  'DONG', 184, NOW()),
                                                                       (1353, '노은3동',  'DONG', 184, NOW()),
                                                                       (1354, '신성동',   'DONG', 184, NOW()),
                                                                       (1355, '온천1동',  'DONG', 184, NOW()),
                                                                       (1356, '온천2동',  'DONG', 184, NOW()),
                                                                       (1357, '관평동',   'DONG', 184, NOW()),
                                                                       (1358, '전민동',   'DONG', 184, NOW()),
                                                                       (1359, '원신흥동', 'DONG', 184, NOW()),
                                                                       (1360, '도안동',   'DONG', 184, NOW());

-- 대전 서구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1361, '둔산1동',  'DONG', 183, NOW()),
                                                                       (1362, '둔산2동',  'DONG', 183, NOW()),
                                                                       (1363, '둔산3동',  'DONG', 183, NOW()),
                                                                       (1364, '월평1동',  'DONG', 183, NOW()),
                                                                       (1365, '갈마1동',  'DONG', 183, NOW()),
                                                                       (1366, '갈마2동',  'DONG', 183, NOW()),
                                                                       (1367, '도마1동',  'DONG', 183, NOW()),
                                                                       (1368, '변동',     'DONG', 183, NOW()),
                                                                       (1369, '탄방동',   'DONG', 183, NOW()),
                                                                       (1370, '정림동',   'DONG', 183, NOW());

-- 대전 중구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1371, '은행동',   'DONG', 182, NOW()),
                                                                       (1372, '선화동',   'DONG', 182, NOW()),
                                                                       (1373, '대흥동',   'DONG', 182, NOW()),
                                                                       (1374, '오류동',   'DONG', 182, NOW()),
                                                                       (1375, '목동',     'DONG', 182, NOW());

-- 대전 동구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1381, '중앙동',   'DONG', 181, NOW()),
                                                                       (1382, '신흥동',   'DONG', 181, NOW()),
                                                                       (1383, '판암1동',  'DONG', 181, NOW()),
                                                                       (1384, '용운동',   'DONG', 181, NOW()),
                                                                       (1385, '대동',     'DONG', 181, NOW());

-- 대전 대덕구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1391, '오정동',   'DONG', 185, NOW()),
                                                                       (1392, '중리동',   'DONG', 185, NOW()),
                                                                       (1393, '법동',     'DONG', 185, NOW()),
                                                                       (1394, '신탄진동', 'DONG', 185, NOW()),
                                                                       (1395, '석봉동',   'DONG', 185, NOW());

-- 울산 남구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1401, '삼산동',   'DONG', 192, NOW()),
                                                                       (1402, '달동',     'DONG', 192, NOW()),
                                                                       (1403, '무거동',   'DONG', 192, NOW()),
                                                                       (1404, '옥동',     'DONG', 192, NOW()),
                                                                       (1405, '신정동',   'DONG', 192, NOW());

-- 울산 중구
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1411, '학성동',   'DONG', 191, NOW()),
                                                                       (1412, '성안동',   'DONG', 191, NOW()),
                                                                       (1413, '복산동',   'DONG', 191, NOW()),
                                                                       (1414, '남외동',   'DONG', 191, NOW()),
                                                                       (1415, '태화동',   'DONG', 191, NOW());

-- 세종
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1421, '한솔동',   'DONG', 196, NOW()),
                                                                       (1422, '도담동',   'DONG', 196, NOW()),
                                                                       (1423, '아름동',   'DONG', 196, NOW()),
                                                                       (1424, '종촌동',   'DONG', 196, NOW()),
                                                                       (1425, '고운동',   'DONG', 196, NOW()),
                                                                       (1426, '보람동',   'DONG', 196, NOW()),
                                                                       (1427, '대평동',   'DONG', 196, NOW()),
                                                                       (1428, '소담동',   'DONG', 196, NOW());

-- 경기 수원시
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1431, '영통동',   'DONG', 201, NOW()),
                                                                       (1432, '매탄1동',  'DONG', 201, NOW()),
                                                                       (1433, '인계동',   'DONG', 201, NOW()),
                                                                       (1434, '팔달로1동','DONG', 201, NOW()),
                                                                       (1435, '화서1동',  'DONG', 201, NOW());

-- 경기 성남시
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1441, '분당동',   'DONG', 202, NOW()),
                                                                       (1442, '정자1동',  'DONG', 202, NOW()),
                                                                       (1443, '서현1동',  'DONG', 202, NOW()),
                                                                       (1444, '야탑1동',  'DONG', 202, NOW()),
                                                                       (1445, '판교동',   'DONG', 202, NOW());

-- 경기 고양시
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1451, '화정1동',  'DONG', 210, NOW()),
                                                                       (1452, '행신1동',  'DONG', 210, NOW()),
                                                                       (1453, '일산1동',  'DONG', 210, NOW()),
                                                                       (1454, '주엽1동',  'DONG', 210, NOW()),
                                                                       (1455, '마두1동',  'DONG', 210, NOW());

-- 경기 용인시
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1461, '기흥동',   'DONG', 219, NOW()),
                                                                       (1462, '수지1동',  'DONG', 219, NOW()),
                                                                       (1463, '죽전1동',  'DONG', 219, NOW()),
                                                                       (1464, '동백동',   'DONG', 219, NOW()),
                                                                       (1465, '처인구청동','DONG', 219, NOW());

-- 경기 안양시
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1471, '비산1동',  'DONG', 204, NOW()),
                                                                       (1472, '평안동',   'DONG', 204, NOW()),
                                                                       (1473, '범계동',   'DONG', 204, NOW()),
                                                                       (1474, '부림동',   'DONG', 204, NOW()),
                                                                       (1475, '호계1동',  'DONG', 204, NOW());

-- 경기 부천시
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1481, '원미1동',  'DONG', 205, NOW()),
                                                                       (1482, '소사본1동','DONG', 205, NOW()),
                                                                       (1483, '심곡1동',  'DONG', 205, NOW()),
                                                                       (1484, '중1동',    'DONG', 205, NOW()),
                                                                       (1485, '상동',     'DONG', 205, NOW());

-- 경기 남양주시
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1491, '화도읍',   'DONG', 213, NOW()),
                                                                       (1492, '와부읍',   'DONG', 213, NOW()),
                                                                       (1493, '진접읍',   'DONG', 213, NOW()),
                                                                       (1494, '별내동',   'DONG', 213, NOW()),
                                                                       (1495, '다산1동',  'DONG', 213, NOW());

-- 경기 화성시
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1501, '동탄1동',  'DONG', 224, NOW()),
                                                                       (1502, '동탄2동',  'DONG', 224, NOW()),
                                                                       (1503, '병점1동',  'DONG', 224, NOW()),
                                                                       (1504, '향남읍',   'DONG', 224, NOW()),
                                                                       (1505, '봉담읍',   'DONG', 224, NOW());

-- 경기 파주시
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1511, '금촌1동',  'DONG', 220, NOW()),
                                                                       (1512, '운정1동',  'DONG', 220, NOW()),
                                                                       (1513, '문산읍',   'DONG', 220, NOW()),
                                                                       (1514, '교하동',   'DONG', 220, NOW()),
                                                                       (1515, '조리읍',   'DONG', 220, NOW());

-- 강원 춘천시
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1521, '조운동',   'DONG', 241, NOW()),
                                                                       (1522, '약사동',   'DONG', 241, NOW()),
                                                                       (1523, '석사동',   'DONG', 241, NOW()),
                                                                       (1524, '후평1동',  'DONG', 241, NOW()),
                                                                       (1525, '퇴계동',   'DONG', 241, NOW());

-- 강원 원주시
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1531, '단구동',   'DONG', 242, NOW()),
                                                                       (1532, '원인동',   'DONG', 242, NOW()),
                                                                       (1533, '태장1동',  'DONG', 242, NOW()),
                                                                       (1534, '무실동',   'DONG', 242, NOW()),
                                                                       (1535, '혁신동',   'DONG', 242, NOW());

-- 강원 강릉시
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1541, '강릉동',   'DONG', 243, NOW()),
                                                                       (1542, '성남동',   'DONG', 243, NOW()),
                                                                       (1543, '교동',     'DONG', 243, NOW()),
                                                                       (1544, '포남1동',  'DONG', 243, NOW()),
                                                                       (1545, '주문진읍', 'DONG', 243, NOW());

-- 충북 청주시
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1551, '사직1동',  'DONG', 261, NOW()),
                                                                       (1552, '용담명암산성동','DONG', 261, NOW()),
                                                                       (1553, '분평동',   'DONG', 261, NOW()),
                                                                       (1554, '복대1동',  'DONG', 261, NOW()),
                                                                       (1555, '오창읍',   'DONG', 261, NOW());

-- 충남 천안시
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1561, '신부동',   'DONG', 281, NOW()),
                                                                       (1562, '쌍용1동',  'DONG', 281, NOW()),
                                                                       (1563, '불당동',   'DONG', 281, NOW()),
                                                                       (1564, '성성동',   'DONG', 281, NOW()),
                                                                       (1565, '두정동',   'DONG', 281, NOW());

-- 충남 아산시
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1571, '온양1동',  'DONG', 284, NOW()),
                                                                       (1572, '배방읍',   'DONG', 284, NOW()),
                                                                       (1573, '탕정면',   'DONG', 284, NOW()),
                                                                       (1574, '음봉면',   'DONG', 284, NOW()),
                                                                       (1575, '신창면',   'DONG', 284, NOW());

-- 전북 전주시
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1581, '완산동',   'DONG', 301, NOW()),
                                                                       (1582, '중화산1동','DONG', 301, NOW()),
                                                                       (1583, '효자1동',  'DONG', 301, NOW()),
                                                                       (1584, '덕진동',   'DONG', 301, NOW()),
                                                                       (1585, '인후1동',  'DONG', 301, NOW());

-- 전남 순천시
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1591, '조례동',   'DONG', 323, NOW()),
                                                                       (1592, '풍덕동',   'DONG', 323, NOW()),
                                                                       (1593, '연향동',   'DONG', 323, NOW()),
                                                                       (1594, '왕지동',   'DONG', 323, NOW()),
                                                                       (1595, '해룡면',   'DONG', 323, NOW());

-- 경북 포항시
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1601, '대이동',   'DONG', 351, NOW()),
                                                                       (1602, '양덕동',   'DONG', 351, NOW()),
                                                                       (1603, '항구동',   'DONG', 351, NOW()),
                                                                       (1604, '두호동',   'DONG', 351, NOW()),
                                                                       (1605, '죽도동',   'DONG', 351, NOW());

-- 경북 구미시
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1611, '원평1동',  'DONG', 355, NOW()),
                                                                       (1612, '송정동',   'DONG', 355, NOW()),
                                                                       (1613, '형곡1동',  'DONG', 355, NOW()),
                                                                       (1614, '신평1동',  'DONG', 355, NOW()),
                                                                       (1615, '광평동',   'DONG', 355, NOW());

-- 경남 창원시
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1621, '의창동',   'DONG', 381, NOW()),
                                                                       (1622, '팔용동',   'DONG', 381, NOW()),
                                                                       (1623, '중앙동',   'DONG', 381, NOW()),
                                                                       (1624, '상남동',   'DONG', 381, NOW()),
                                                                       (1625, '진해동',   'DONG', 381, NOW());

-- 경남 김해시
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1631, '내외동',   'DONG', 385, NOW()),
                                                                       (1632, '부원동',   'DONG', 385, NOW()),
                                                                       (1633, '장유1동',  'DONG', 385, NOW()),
                                                                       (1634, '진영읍',   'DONG', 385, NOW()),
                                                                       (1635, '율하동',   'DONG', 385, NOW());

-- 제주 제주시
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1641, '일도1동',  'DONG', 401, NOW()),
                                                                       (1642, '이도1동',  'DONG', 401, NOW()),
                                                                       (1643, '삼도1동',  'DONG', 401, NOW()),
                                                                       (1644, '노형동',   'DONG', 401, NOW()),
                                                                       (1645, '연동',     'DONG', 401, NOW());

-- 제주 서귀포시
INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES
                                                                       (1651, '송산동',   'DONG', 402, NOW()),
                                                                       (1652, '정방동',   'DONG', 402, NOW()),
                                                                       (1653, '중앙동',   'DONG', 402, NOW()),
                                                                       (1654, '효돈동',   'DONG', 402, NOW()),
                                                                       (1655, '대천동',   'DONG', 402, NOW());

-- Business seller demo accounts and time-sale products
INSERT IGNORE INTO users
    (id, email, password_hash, nickname, phone, role, region_id, no_show_count, purchase_restricted_until, created_at, updated_at)
VALUES
    (9001, 'test@123', '$2a$10$32yRN9ubSctzffU/I2K7M.v8esFF2AaTy9sC8tqJV2cGPnlPXvFXC', '맛난이그린마켓', '010-9001-0001', 'BUSINESS', 101, 0, NULL, NOW(), NOW()),
    (9002, 'bakery@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '동네착한베이커리', '010-9002-0002', 'BUSINESS', 102, 0, NULL, NOW(), NOW());

UPDATE users
SET email = 'test@123',
    password_hash = '$2a$10$32yRN9ubSctzffU/I2K7M.v8esFF2AaTy9sC8tqJV2cGPnlPXvFXC',
    role = 'BUSINESS',
    updated_at = NOW()
WHERE id = 9001;

INSERT IGNORE INTO business_profiles
    (id, user_id, business_number, business_name, owner_name, verify_status, verified_at, created_at, updated_at)
VALUES
    (9001, 9001, '1234567890', '맛난이그린마켓', '김사업', 'VERIFIED', NOW(), NOW(), NOW()),
    (9002, 9002, '2234567890', '동네착한베이커리', '이사업', 'VERIFIED', NOW(), NOW(), NOW());

INSERT IGNORE INTO products
    (id, seller_id, region_id, title, description, category, defect_reason, original_price, discount_price, discount_rate, status, pickup_place, pickup_start_at, pickup_end_at, expires_at, time_sale, total_quantity, per_person_limit, remaining_quantity, created_at, updated_at)
VALUES
    (9001, 9001, 101, '못난이 토마토 2kg', '모양은 고르지 않지만 오늘 바로 먹기 좋은 토마토입니다.', 'PRODUCE_SEAFOOD', 'SHAPE_BAD', 12000, 5900, 50.83, 'ON_SALE', '종로구청 앞', DATE_ADD(NOW(), INTERVAL 2 HOUR), DATE_ADD(NOW(), INTERVAL 5 HOUR), DATE_ADD(NOW(), INTERVAL 8 HOUR), true, 8, 2, 8, NOW(), NOW()),
    (9002, 9002, 102, '당일 생산 크루아상 4개입', '마감 전 남은 당일 생산 베이커리입니다.', 'BAKERY_DESSERT', 'NEAR_EXPIRY', 10000, 4900, 51.00, 'ON_SALE', '을지로입구역 2번 출구', DATE_ADD(NOW(), INTERVAL 1 HOUR), DATE_ADD(NOW(), INTERVAL 4 HOUR), DATE_ADD(NOW(), INTERVAL 6 HOUR), true, 6, 1, 6, NOW(), NOW());

INSERT IGNORE INTO product_images
    (product_id, image_url, sort_order)
VALUES
    (9001, 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=900&q=80', 0),
    (9002, 'https://images.unsplash.com/photo-1555507036-ab794f4afe5d?auto=format&fit=crop&w=900&q=80', 0);
