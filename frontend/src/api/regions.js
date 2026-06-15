import client from "./client";

export async function fetchCities() {
  const res = await client.get("/api/regions");
  return res.data.data;
}

export async function fetchChildren(parentId) {
  const res = await client.get("/api/regions", { params: { parentId } });
  return res.data.data;
}

export async function searchRegions(keyword) {
  if (!keyword || keyword.trim().length < 1) return [];
  const res = await client.get("/api/regions/search", { params: { q: keyword.trim() } });
  return res.data.data;
}
