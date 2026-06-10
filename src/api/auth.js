import client from "./client";
import { normalizeRegionLabel } from "../utils/regions";

export function getSavedUser() {
  try {
    const savedUser = localStorage.getItem("matnaniUser");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    localStorage.removeItem("matnaniUser");
    localStorage.removeItem("matnaniToken");
    return null;
  }
}

export async function loginUser({ email, password, region }) {
  const response = await client.post("/api/auth/login", { email, password });
  const { accessToken, nickname, role, regionName } = response.data.data;
  const normalizedRegion = regionName || region ? normalizeRegionLabel(regionName || region) : undefined;

  localStorage.setItem("matnaniToken", accessToken);
  localStorage.setItem(
    "matnaniUser",
    JSON.stringify({ email, nickname, role, ...(normalizedRegion ? { region: normalizedRegion } : {}) }),
  );

  return { email, nickname, role, region: normalizedRegion };
}

export async function signupUser({ email, password, nickname, phone, regionId }) {
  await client.post("/api/auth/signup", { email, password, nickname, phone, regionId });
  return loginUser({ email, password });
}

export async function logoutUser() {
  localStorage.removeItem("matnaniToken");
  localStorage.removeItem("matnaniUser");
}
