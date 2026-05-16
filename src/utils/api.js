import axios from "axios";

// Normalize base URL so env can be either "http://localhost:5000" OR "http://localhost:5000/api"
const rawBaseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
const normalizedBaseUrl = rawBaseUrl.endsWith("/api")
  ? rawBaseUrl
  : `${rawBaseUrl.replace(/\/$/, "")}/api`;

// Create axios instance with base configuration
const api = axios.create({
  baseURL: normalizedBaseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const getStoredToken = () => {
  const token = localStorage.getItem("adminToken");
  if (!token || token.startsWith("demo-token-")) return null;
  return token;
};

const applyAuthHeaders = (config) => {
  const token = getStoredToken();
  if (!token) return config;

  if (typeof config.headers?.set === "function") {
    config.headers.set("Authorization", `Bearer ${token}`);
  } else {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  // Let the browser set multipart boundary for file uploads
  if (config.data instanceof FormData) {
    if (typeof config.headers.delete === "function") {
      config.headers.delete("Content-Type");
    } else if (config.headers) {
      delete config.headers["Content-Type"];
    }
  }

  return config;
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => applyAuthHeaders(config),
  (error) => Promise.reject(error)
);

const multipartAuthConfig = () => {
  const token = getStoredToken();
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const isLoginRequest = (config) => {
  const url = config?.url || "";
  return url.includes("/auth/admin/login") || url.includes("/auth/login");
};

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const config = error.config;

    if (status === 401 && !isLoginRequest(config)) {
      const token = localStorage.getItem("adminToken");
      // Demo sessions are client-only; don't tear down auth on API 401s
      if (token && !token.startsWith("demo-token-")) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("admin:session-expired"));
        }
      }
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (credentials) => api.post("/auth/admin/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
  changePassword: (data) => api.put("/auth/change-password", data),
};

export const productAPI = {
  getAll: (params) => api.get("/products", { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  toggleStatus: (id) => api.patch(`/products/${id}/toggle-status`),
  uploadImage: (formData) =>
    api.post("/products/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getStats: () => api.get("/products/stats"),
};

export const categoryAPI = {
  getAll: () => api.get("/categories"),
  create: (data) => api.post("/categories", data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const orderAPI = {
  getAll: (params) => api.get("/orders", { params }),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

export const userAPI = {
  getAll: () => api.get("/users"),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post("/auth/register", data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const bannerAPI = {
  getAll: () => api.get("/banners"),
  getById: (id) => api.get(`/banners/${id}`),
  create: (data) => api.post("/banners", data, multipartAuthConfig()),
  update: (id, data) => api.put(`/banners/${id}`, data, multipartAuthConfig()),
  delete: (id) => api.delete(`/banners/${id}`),
  toggleStatus: (id) => api.patch(`/banners/${id}/toggle`),
  reorder: (bannerOrders) =>
    api.post("/banners/reorder", { bannerOrders }),
};

export const legalAPI = {
  getAll: () => api.get("/legal"),
  getByType: (type) => api.get(`/legal/${type}`),
  update: (type, data) => api.put(`/legal/${type}`, data),
  create: (type, data) => api.post("/legal", { type, ...data }),
};

export const settingsAPI = {
  get: () => api.get("/settings"),
  update: (data) => api.put("/settings", data),
  // If you ever want to preview from admin without auth:
  getPublic: () => api.get("/settings/public"),
};

export default api;
