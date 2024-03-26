import axios from "axios";

// 創建 Axios 實例
const apiClient = axios.create({
  baseURL: "/",
  // baseURL: process.env.VUE_APP_API_BASE_URL, // 設置所有 Axios 請求的基本 URL。
  headers: {
    "Content-Type": "application/json",
  },
});

// 請求攔截器
apiClient.interceptors.request.use(
  (config) => {
    // 檢查本地存取是否有 token
    const token = localStorage.getItem("token");

    // 如果有 token，則添加道請求頭部
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 返回配置
    return config;
  },
  (error) => {
    // 處理請求錯誤
    console.error("Request error:", error);

    return Promise.reject(error);
  }
);

// 響應攔截器
apiClient.interceptors.response.use(
  (response) => {
    // 處理響應數據
    return response;
  },
  (error) => {
    // 響應錯誤處理
    if (error.response && error.response.status === 401) {
      // 處理401未認證的錯誤，重訂定位到登入頁面
      window.location.href = "/login";
    }

    // 顯示全局錯誤的消息
    // alert(`錯誤提醒: ${error.message},請截圖回報管理人員`);

    return Promise.reject(error);
  }
);

export default apiClient;
