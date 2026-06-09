const MOCK_ACCESS_TOKEN = "mock-access-token";

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

export async function loginUser(user) {
  localStorage.setItem("matnaniToken", MOCK_ACCESS_TOKEN);
  localStorage.setItem("matnaniUser", JSON.stringify(user));

  return user;
}

export async function logoutUser() {
  localStorage.removeItem("matnaniToken");
  localStorage.removeItem("matnaniUser");
}
