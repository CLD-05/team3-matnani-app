import { regionOptions } from "../data/constants";

export const DEFAULT_REGION = regionOptions[0];
export const DEFAULT_REGION_LABEL = DEFAULT_REGION.label;

export function findRegion(value) {
  if (!value) return DEFAULT_REGION;

  return (
    regionOptions.find(
      (region) =>
        region.label === value ||
        region.dong === value ||
        region.regionName === value ||
        String(value).includes(region.dong),
    ) || DEFAULT_REGION
  );
}

export function normalizeRegionLabel(value) {
  return findRegion(value).label;
}

export function getRegionDong(value) {
  return findRegion(value).dong;
}

export function getRegionId(value) {
  const normalizedLabel = normalizeRegionLabel(value);
  const index = regionOptions.findIndex((region) => region.label === normalizedLabel);
  return index >= 0 ? index + 1 : 1;
}

export function getRegionLabelById(value) {
  const index = Number(value) - 1;
  return regionOptions[index]?.label || DEFAULT_REGION_LABEL;
}

export function filterRegions(keyword) {
  const trimmedKeyword = keyword.trim();
  if (!trimmedKeyword) return regionOptions;

  return regionOptions.filter(
    (region) =>
      region.label.includes(trimmedKeyword) ||
      region.city.includes(trimmedKeyword) ||
      region.district.includes(trimmedKeyword) ||
      region.dong.includes(trimmedKeyword),
  );
}
