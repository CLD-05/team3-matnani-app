import React from "react";
import { Search } from "lucide-react";

export function RegionSearchPanel({
  keyword,
  results,
  includeAll = false,
  onKeywordChange,
  onSelect,
}) {
  return (
    <div className="region-search-panel">
      <div className="region-search-box">
        <input
          type="search"
          placeholder="동 이름을 입력해주세요. 예: 성수동"
          value={keyword}
          onChange={(event) => onKeywordChange(event.target.value)}
        />
        <Search size={21} />
      </div>
      <div className="region-result-list" aria-label="지역 검색 결과">
        {includeAll && (
          <button className="region-result-item" type="button" onClick={() => onSelect("전체")}>
            <span>
              <strong>전체 지역</strong>
              <small>모든 동네 상품 보기</small>
            </span>
            <em>선택</em>
          </button>
        )}
        {results.map((region) => (
          <button
            className="region-result-item"
            key={region.label}
            type="button"
            onClick={() => onSelect(region.label)}
          >
            <span>
              <strong>{region.label}</strong>
              <small>동 단위 지역 선택</small>
            </span>
            <em>선택</em>
          </button>
        ))}
        {results.length === 0 && <p className="empty-region">검색 결과가 없습니다.</p>}
      </div>
    </div>
  );
}
