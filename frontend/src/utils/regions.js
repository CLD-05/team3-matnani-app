export function getSavedRegion() {
  try {
    const saved = localStorage.getItem("selectedRegion");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function saveRegion(region) {
  try {
    if (region) {
      localStorage.setItem("selectedRegion", JSON.stringify(region));
    } else {
      localStorage.removeItem("selectedRegion");
    }
  } catch {}
}
