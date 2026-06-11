import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
});

// 요청마다 JWT 토큰 자동 첨부
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("matnaniToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 응답 시 자동 로그아웃
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("matnaniToken");
      localStorage.removeItem("matnaniUser");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default client;
