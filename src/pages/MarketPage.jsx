import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  categories,
  productStatuses,
  regionOptions,
  sortOptions,
} from "../data/constants";
import { FilterGroup } from "../components/FilterGroup";
import { PageIntro } from "../components/PageIntro";
import { ProductCard } from "../components/ProductCard";
import { RegionSearchPanel } from "../components/RegionSearchPanel";

export function MarketPage({ products, onNavigate }) {
  const [category, setCategory] = useState("전체");
  const [neighborhood, setNeighborhood] = useState("전체");
  const [status, setStatus] = useState("전체");
  const [sort, setSort] = useState("latest");
  const [regionSearchOpen, setRegionSearchOpen] = useState(false);
  const [regionKeyword, setRegionKeyword] = useState("");

  const regionResults = regionOptions.filter((region) => {
    const keyword = regionKeyword.trim();
    if (!keyword) return true;
    return region.label.includes(keyword) || region.dong.includes(keyword);
  });

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const categoryMatched = category === "전체" || product.category === category;
      const selectedDong = regionOptions.find((region) => region.label === neighborhood)?.dong;
      const regionMatched = neighborhood === "전체" || product.region === selectedDong;
      const statusMatched = status === "전체" || product.status === status;
      return categoryMatched && regionMatched && statusMatched;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "near_expiry") return a.expiresInMinutes - b.expiresInMinutes;
      if (sort === "discount_high") return b.discount - a.discount;
      if (sort === "price_low") return a.priceValue - b.priceValue;
      if (sort === "price_high") return b.priceValue - a.priceValue;
      if (sort === "review_count") return b.reviews - a.reviews;
      if (sort === "rating_high") return Number(b.rating) - Number(a.rating);
      return a.createdMinutes - b.createdMinutes;
    });
  }, [category, neighborhood, products, sort, status]);

  return (
    <>
      <PageIntro
        kicker="못난이 장터"
        title="전체 상품을 조건에 맞게 찾아보세요"
        description="카테고리, 지역, 정렬 기준을 바꿔 원하는 상품을 빠르게 탐색할 수 있습니다."
      />
      <section className="market-toolbar" aria-label="상품 필터">
        <div className="search-box market-search">
          <Search size={22} />
          <input type="search" placeholder="상품을 검색하세요" />
        </div>

        <FilterGroup label="카테고리">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? "active" : ""}
              type="button"
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </FilterGroup>

        <div className="region-filter">
          <div className="region-filter-head">
            <span>지역</span>
            <button
              className={regionSearchOpen ? "region-toggle active" : "region-toggle"}
              type="button"
              onClick={() => setRegionSearchOpen((prev) => !prev)}
            >
              {neighborhood === "전체" ? "지역 검색" : neighborhood}
            </button>
          </div>
          {regionSearchOpen && (
            <RegionSearchPanel
              keyword={regionKeyword}
              results={regionResults}
              includeAll
              onKeywordChange={setRegionKeyword}
              onSelect={(regionLabel) => {
                setNeighborhood(regionLabel);
                setRegionSearchOpen(false);
              }}
            />
          )}
        </div>

        <FilterGroup label="판매 상태">
          {productStatuses.map((item) => (
            <button
              key={item}
              className={status === item ? "active" : ""}
              type="button"
              onClick={() => setStatus(item)}
            >
              {item}
            </button>
          ))}
        </FilterGroup>

        <div className="sort-select">
          <label htmlFor="sort">정렬</label>
          <select id="sort" value={sort} onChange={(event) => setSort(event.target.value)}>
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="content">
        <div className="section-head">
          <div>
            <span className="section-kicker">전체 상품</span>
            <h2>{filteredProducts.length}개의 상품</h2>
          </div>
        </div>
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => onNavigate(`/products/${product.id}`)}
            />
          ))}
        </div>
      </section>
    </>
  );
}
