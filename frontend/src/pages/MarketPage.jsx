import React, { useEffect, useMemo, useState } from "react";
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

function isAllOption(value) {
  return value === categories[0] || value === productStatuses[0];
}

function getRegionDong(value) {
  const matchedRegion = regionOptions.find(
    (region) => region.label === value || region.dong === value,
  );
  return matchedRegion?.dong || value;
}

function matchesSelectedRegion(product, selectedRegion) {
  if (isAllOption(selectedRegion)) return true;

  const selectedDong = getRegionDong(selectedRegion);
  const productRegions = [product.region, product.regionName, product.regionLabel].filter(Boolean);

  return productRegions.some((region) => {
    const regionDong = getRegionDong(region);
    return (
      region === selectedRegion ||
      region === selectedDong ||
      regionDong === selectedDong ||
      String(region).includes(selectedDong)
    );
  });
}

function matchesSelectedStatus(product, selectedStatus) {
  if (isAllOption(selectedStatus)) return true;

  const statusToneByLabel = {
    [productStatuses[1]]: "sale",
    [productStatuses[2]]: "reserved",
    [productStatuses[3]]: "soldout",
  };

  return product.status === selectedStatus || product.statusTone === statusToneByLabel[selectedStatus];
}

function getNumericValue(value) {
  if (typeof value === "number") return value;
  return Number(String(value || "").replace(/[^0-9.-]/g, "")) || 0;
}

function getDeadlineMinutes(product) {
  const deadlineAt = product.pickupEndAt || product.pickupStartAt;

  if (deadlineAt) {
    const minutes = Math.round((new Date(deadlineAt).getTime() - Date.now()) / 60000);
    return Number.isFinite(minutes) ? Math.max(0, minutes) : Number.MAX_SAFE_INTEGER;
  }

  return getNumericValue(product.deadlineInMinutes ?? product.expiresInMinutes);
}

function getCreatedMinutes(product) {
  if (product.createdAt) {
    const minutes = Math.round((Date.now() - new Date(product.createdAt).getTime()) / 60000);
    return Number.isFinite(minutes) ? minutes : Number.MAX_SAFE_INTEGER;
  }

  return getNumericValue(product.createdMinutes);
}

function getMarketParams() {
  return new URLSearchParams(window.location.search);
}

export function MarketPage({ products, currentUser, selectedRegionLabel, onNavigate }) {
  const initialParams = getMarketParams();
  const [category, setCategory] = useState("전체");
  const [neighborhood, setNeighborhood] = useState(selectedRegionLabel || "전체");
  const [status, setStatus] = useState("전체");
  const [sort, setSort] = useState(initialParams.get("sort") || "latest");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [hideMyProducts, setHideMyProducts] = useState(false);
  const [showTimeSaleOnly, setShowTimeSaleOnly] = useState(initialParams.get("timeSale") === "1");
  const [showPopularOnly, setShowPopularOnly] = useState(initialParams.get("popular") === "1");
  const [regionSearchOpen, setRegionSearchOpen] = useState(false);
  const [regionKeyword, setRegionKeyword] = useState("");

  const regionResults = regionOptions.filter((region) => {
    const keyword = regionKeyword.trim();
    if (!keyword) return true;
    return region.label.includes(keyword) || region.dong.includes(keyword);
  });

  useEffect(() => {
    if (selectedRegionLabel) {
      setNeighborhood(selectedRegionLabel);
    }
  }, [selectedRegionLabel]);

  const filteredProducts = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const categoryMatched = category === "전체" || product.category === category;
      const selectedDong = regionOptions.find((region) => region.label === neighborhood)?.dong;
      const regionMatched = neighborhood === "전체" || product.region === selectedDong;
      const statusMatched = status === "전체" || product.status === status;
      const searchableText = [
        product.title,
        product.seller,
        product.region,
        product.category,
        product.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const keywordMatched = !keyword || searchableText.includes(keyword);
      const robustCategoryMatched = isAllOption(category) || product.category === category;
      const robustRegionMatched = matchesSelectedRegion(product, neighborhood);
      const robustStatusMatched = matchesSelectedStatus(product, status);
      const myProductMatched =
        !hideMyProducts || !currentUser || product.seller !== currentUser.nickname;
      const timeSaleMatched = !showTimeSaleOnly || product.timeSale;
      const popularMatched =
        !showPopularOnly ||
        (
          Number(product.remainingQuantity ?? 0) > 0 &&
          (Number(product.reservedQuantity || 0) > 0 || Number(product.completedQuantity || 0) > 0)
        );
      return (
        robustCategoryMatched &&
        robustRegionMatched &&
        robustStatusMatched &&
        keywordMatched &&
        myProductMatched &&
        timeSaleMatched &&
        popularMatched
      );
    });

    return [...filtered].sort((a, b) => {
      if (showPopularOnly) {
        const bActivity = Number(b.reservedQuantity || 0) + Number(b.completedQuantity || 0);
        const aActivity = Number(a.reservedQuantity || 0) + Number(a.completedQuantity || 0);
        return bActivity - aActivity || Number(b.rating) - Number(a.rating);
      }
      if (sort === "near_expiry") return getDeadlineMinutes(a) - getDeadlineMinutes(b);
      if (sort === "discount_high") return getNumericValue(b.discount) - getNumericValue(a.discount);
      if (sort === "price_low") return getNumericValue(a.priceValue) - getNumericValue(b.priceValue);
      if (sort === "price_high") return getNumericValue(b.priceValue) - getNumericValue(a.priceValue);
      if (sort === "review_count") return getNumericValue(b.reviews) - getNumericValue(a.reviews);
      if (sort === "rating_high") return Number(b.rating) - Number(a.rating);
      return getCreatedMinutes(a) - getCreatedMinutes(b);
    });
  }, [category, currentUser, hideMyProducts, neighborhood, products, searchKeyword, showPopularOnly, showTimeSaleOnly, sort, status]);

  return (
    <>
      <PageIntro
        kicker="맛난이 장터"
        title="전체 상품을 조건에 맞게 찾아보세요"
        description="카테고리, 지역, 정렬 기준을 바꿔 원하는 상품을 빠르게 탐색할 수 있습니다."
      />
      <section className="market-toolbar" aria-label="상품 필터">
        <div className="search-box market-search">
          <Search size={22} />
          <input
            type="search"
            placeholder="상품명, 판매자, 지역을 검색하세요"
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
          />
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

        {currentUser && (
          <label className="market-toggle-filter">
            <input
              type="checkbox"
              checked={hideMyProducts}
              onChange={(event) => setHideMyProducts(event.target.checked)}
            />
            <span>내가 판매중인 상품 제외</span>
          </label>
        )}
        <label className="market-toggle-filter">
          <input
            type="checkbox"
            checked={showTimeSaleOnly}
            onChange={(event) => setShowTimeSaleOnly(event.target.checked)}
          />
          <span>타임특가만 보기</span>
        </label>
        <label className="market-toggle-filter">
          <input
            type="checkbox"
            checked={showPopularOnly}
            onChange={(event) => setShowPopularOnly(event.target.checked)}
          />
          <span>반응 좋은 상품만 보기</span>
        </label>
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
