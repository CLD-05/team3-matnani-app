import React, { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { searchRegions } from "../api/regions";
import { useRegionSelector } from "../hooks/useRegionSelector";

export function RegionSearchPanel({ includeAll = false, onSelect }) {
  const {
    cities,
    districts,
    dongs,
    selectedCity,
    selectedDistrict,
    selectedDong,
    selectCity,
    selectDistrict,
    selectDong,
  } = useRegionSelector();

  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!keyword.trim()) {
      setSearchResults([]);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await searchRegions(keyword);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [keyword]);

  const handleSearchSelect = (result) => {
    onSelect({ id: result.id, name: result.name, label: result.label });
    setKeyword("");
    setSearchResults([]);
  };

  const handleDongSelect = (dong) => {
    selectDong(dong);
    onSelect({
      id: dong.id,
      name: dong.name,
      label: `${selectedCity?.name} ${selectedDistrict?.name} ${dong.name}`,
    });
  };

  const isSearchMode = keyword.trim().length > 0;

  const panelClass = selectedDistrict
    ? "region-panel triple"
    : selectedCity
      ? "region-panel double"
      : "region-panel";

  return (
    <div className="region-search-panel">
      {/* 검색창 */}
      <div className="region-search-box">
        <Search size={16} />
        <input
          type="text"
          placeholder="동 이름으로 검색 (예: 역삼동)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          autoComplete="off"
        />
      </div>

      {/* 검색 결과 */}
      {isSearchMode ? (
        <ul className="region-result-list">
          {searching && (
            <li style={{ padding: "16px", color: "#9ba49b", fontWeight: 800, fontSize: 14 }}>
              검색 중...
            </li>
          )}
          {!searching && searchResults.length === 0 && (
            <li className="empty-region">검색 결과가 없습니다.</li>
          )}
          {!searching && searchResults.map((result) => (
            <li key={result.id}>
              <button
                className="region-result-item"
                type="button"
                onClick={() => handleSearchSelect(result)}
              >
                <span>
                  <strong>{result.name}</strong>
                  <small>{result.cityName} {result.districtName}</small>
                </span>
                <em>선택</em>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <>
          {includeAll && (
            <button
              className="region-all-button"
              type="button"
              onClick={() => onSelect({ id: null, name: "전체", label: "전체" })}
            >
              <span>전체 지역</span>
              <em>선택</em>
            </button>
          )}

          <div className={panelClass}>
            {/* 1단계: 시/도 */}
            <div className="region-cities">
              {cities.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  className={selectedCity?.id === city.id ? "active" : ""}
                  onClick={() => selectCity(city)}
                >
                  {city.name}
                </button>
              ))}
            </div>

            {/* 2단계: 구/군 */}
            {selectedCity && (
              <div className="region-districts">
                {districts.length === 0 ? (
                  <p className="region-step-hint">불러오는 중...</p>
                ) : (
                  districts.map((district) => (
                    <button
                      key={district.id}
                      type="button"
                      className={selectedDistrict?.id === district.id ? "active" : ""}
                      onClick={() => selectDistrict(district)}
                    >
                      {district.name}
                    </button>
                  ))
                )}
              </div>
            )}

            {/* 3단계: 읍/면/동 */}
            {selectedDistrict && (
              <div className="region-dong-grid">
                {dongs.length === 0 ? (
                  <p className="region-step-hint">불러오는 중...</p>
                ) : (
                  dongs.map((dong) => (
                    <button
                      key={dong.id}
                      type="button"
                      className={selectedDong?.id === dong.id ? "active" : ""}
                      onClick={() => handleDongSelect(dong)}
                    >
                      {dong.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
