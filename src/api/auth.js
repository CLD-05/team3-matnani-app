import client from "./client";

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

export async function loginUser({ email, password }) {
  const response = await client.post("/api/auth/login", { email, password });
  const { accessToken, nickname, role } = response.data.data;

  localStorage.setItem("matnaniToken", accessToken);
  localStorage.setItem("matnaniUser", JSON.stringify({ email, nickname, role }));

  return { email, nickname, role };
}

export async function signupUser({ email, password, nickname, phone, regionId }) {
  await client.post("/api/auth/signup", { email, password, nickname, phone, regionId });
  return loginUser({ email, password });
}

export async function logoutUser() {
  localStorage.removeItem("matnaniToken");
  localStorage.removeItem("matnaniUser");
}
