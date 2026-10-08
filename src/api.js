import axios from "axios";

const { VITE_APP_API_URL, VITE_APP_API_PATH } = import.meta.env;

// 從 cookie 取出 hexToken
export const getToken = () => {
  const row = document.cookie
    .split("; ")
    .find((item) => item.startsWith("hexToken="));
  return row ? row.slice("hexToken=".length) : "";
};

// 清除 hexToken (設為過期)
export const clearToken = () => {
  document.cookie = "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

// 前台 API: /v2/api/{path}
export const api = axios.create({
  baseURL: `${VITE_APP_API_URL}v2/api/${VITE_APP_API_PATH}`,
});

// 後台 API: /v2/api/{path}/admin,每次請求自動帶上 token
export const adminApi = axios.create({
  baseURL: `${VITE_APP_API_URL}v2/api/${VITE_APP_API_PATH}/admin`,
});
adminApi.interceptors.request.use((config) => {
  config.headers.Authorization = getToken();
  return config;
});

// 取得錯誤訊息 (網路斷線時 err.response 會是 undefined)
export const getErrorData = (err) =>
  err.response?.data || { success: false, message: "網路錯誤,請稍後再試" };
