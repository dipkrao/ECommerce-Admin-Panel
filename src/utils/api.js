import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    console.log("API Request:", config.method?.toUpperCase(), config.url);
    console.log("Request data:", config.data);
    console.log("Request headers:", config.headers);

    const token = localStorage.getItem("adminToken");
    if (token && !token.startsWith("demo-token-")) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Using real token:", token.substring(0, 20) + "...");
    } else {
      console.log("Using demo token or no token:", token);
    }

    // Remove Content-Type header for FormData to allow browser to set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
      console.log("Removed Content-Type header for FormData");
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.config.url);
    console.log("Response data:", response.data);
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.status, error.config?.url);
    console.error(
      "Error message:",
      error.response?.data?.message || error.message
    );
    console.error("Full error:", error);

    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("adminToken");
      window.location.href = "/login";
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
  create: (data) => api.post("/banners", data),
  update: (id, data) => api.put(`/banners/${id}`, data),
  delete: (id) => api.delete(`/banners/${id}`),
  toggleStatus: (id) => api.patch(`/banners/${id}/toggle`),
  reorder: (bannerOrders) => api.post("/banners/reorder", { bannerOrders }),
};

export const legalAPI = {
  getAll: () => api.get("/legal"),
  getByType: (type) => api.get(`/legal/${type}`),
  update: (type, data) => api.put(`/legal/${type}`, data),
  create: (type, data) => api.post("/legal", { type, ...data }),
};

export default api;
