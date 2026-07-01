#!/usr/bin/env python3
"""
전국 읍/면/동 데이터를 행정안전부 공개 API에서 받아
data.sql에 추가할 INSERT SQL을 생성하는 스크립트

사용법:
  pip install requests
  python3 generate_dong_sql.py > dong_data.sql
  # dong_data.sql 내용을 regions.sql 끝에 붙여넣으면 됩니다
"""
import requests
import re
import sys
from pathlib import Path

BASE_URL = "https://grpc-proxy-server-mkvo6j4wsq-du.a.run.app/v1/regcodes"

# 행정구역코드 앞 2자리 → 내부 시/도 ID (regions.sql 기준)
CITY_PREFIX_TO_ID = {
    '11': 1,   # 서울특별시
    '26': 2,   # 부산광역시
    '27': 3,   # 대구광역시
    '28': 4,   # 인천광역시
    '29': 5,   # 광주광역시
    '30': 6,   # 대전광역시
    '31': 7,   # 울산광역시
    '36': 8,   # 세종특별자치시
    '41': 9,   # 경기도
    '42': 10, '51': 10,  # 강원특별자치도 (코드 변경 대응)
    '43': 11,  # 충청북도
    '44': 12,  # 충청남도
    '45': 13, '52': 13,  # 전북특별자치도 (코드 변경 대응)
    '46': 14,  # 전라남도
    '47': 15,  # 경상북도
    '48': 16,  # 경상남도
    '50': 17,  # 제주특별자치도
}


def fetch(pattern):
    try:
        r = requests.get(
            BASE_URL,
            params={'regcode_pattern': pattern, 'is_ignore_zero': 'true'},
            timeout=20
        )
        return r.json().get('regcodes', [])
    except Exception as e:
        print(f"# API 오류 ({pattern}): {e}", file=sys.stderr)
        return []


def last_part(full_name):
    """'서울특별시 종로구 청운효자동' → '청운효자동'"""
    return full_name.strip().split()[-1]


def parse_district_map(sql_content):
    """data.sql에서 (city_id, district_name) → internal_id 파싱"""
    pattern = r"\((\d+),\s*'([^']+)',\s*'DISTRICT',\s*(\d+),"
    result = {}
    for m in re.finditer(pattern, sql_content):
        internal_id = int(m.group(1))
        name = m.group(2)
        city_id = int(m.group(3))
        result[(city_id, name)] = internal_id
    return result


def get_max_dong_id(sql_content):
    existing = re.findall(r"\((\d+),\s*'[^']+',\s*'DONG'", sql_content)
    return max((int(x) for x in existing), default=9999)


def main():
    # regions.sql 경로
    sql_path = Path(__file__).parent / 'src/main/resources/regions.sql'
    if not sql_path.exists():
        print(f"regions.sql 파일을 찾을 수 없습니다: {sql_path}", file=sys.stderr)
        sys.exit(1)

    sql_content = sql_path.read_text(encoding='utf-8')
    district_map = parse_district_map(sql_content)
    dong_id = get_max_dong_id(sql_content) + 1

    print("-- 전국 읍/면/동 데이터 (generate_dong_sql.py 자동 생성)")
    print("-- DONG\n")

    # 전체 시/도 목록 가져오기
    cities = fetch('*00000000')
    if not cities:
        print("시/도 목록을 가져오지 못했습니다. API 상태를 확인하세요.", file=sys.stderr)
        sys.exit(1)

    for city in cities:
        city_code = city['code']
        prefix = city_code[:2]
        city_id = CITY_PREFIX_TO_ID.get(prefix)

        if not city_id:
            print(f"# 매핑 없음: {city['name']} (prefix={prefix})", file=sys.stderr)
            continue

        # 해당 시/도의 구/군 목록
        districts = fetch(prefix + '*' + '0' * 6)

        for district in districts:
            dist_code = district['code']
            dist_name = last_part(district['name'])

            # 세종특별자치시 특수처리 (구/군 없음)
            if city_id == 8:
                dist_internal_id = 196
            else:
                dist_internal_id = district_map.get((city_id, dist_name))
                if not dist_internal_id:
                    print(f"# 구/군 매핑 없음: {city['name']} > {dist_name}", file=sys.stderr)
                    continue

            # 읍/면/동 목록 (구/군 코드 앞 5자리 + *)
            dongs = fetch(dist_code[:5] + '*')
            if not dongs:
                continue

            values = []
            for dong in dongs:
                dong_name = last_part(dong['name'])
                if not dong_name:
                    continue
                values.append(
                    f"    ({dong_id}, '{dong_name}', 'DONG', {dist_internal_id}, NOW())"
                )
                dong_id += 1

            if values:
                print(f"-- {city['name']} {dist_name}")
                print("INSERT IGNORE INTO regions (id, name, region_type, parent_id, created_at) VALUES")
                print(',\n'.join(values) + ';\n')

    print(f"-- 완료: DONG ID {get_max_dong_id(sql_content) + 1} ~ {dong_id - 1}", file=sys.stderr)


if __name__ == '__main__':
    main()
