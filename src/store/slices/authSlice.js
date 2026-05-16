import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from "../../utils/api";
import toast from "react-hot-toast";

// Async thunks
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      // Always try the real API first
      const response = await authAPI.login(credentials);
      return response.data;
    } catch (error) {
      if (!error.response) {
        return rejectWithValue(
          "Cannot reach the API server. Start the backend (port 5000), then sign in with admin@example.com / admin123."
        );
      }
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token || token.startsWith("demo-token-")) {
        throw new Error("Not authenticated");
      }
      const response = await authAPI.getProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to get profile");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token || token.startsWith("demo-token-")) {
        throw new Error("Not authenticated");
      }
      const response = await authAPI.updateProfile(profileData);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Profile update failed"
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (passwordData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token || token.startsWith("demo-token-")) {
        throw new Error("Not authenticated");
      }
      await authAPI.changePassword(passwordData);
      return true;
    } catch (error) {
      return rejectWithValue(error.message || "Password change failed");
    }
  }
);

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem("adminUser");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const normalizeAuthPayload = (payload) => {
  if (!payload) return { token: null, user: null };
  const token = payload.token ?? payload.accessToken ?? null;
  const user = payload.user ?? payload.admin ?? payload.data?.user ?? null;
  return { token, user };
};

const getStoredToken = () => {
  const token = localStorage.getItem("adminToken");
  if (!token || token.startsWith("demo-token-")) {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    return null;
  }
  return token;
};

const storedToken = getStoredToken();

const initialState = {
  user: storedToken ? getStoredUser() : null,
  token: storedToken,
  loading: false,
  error: null,
  isAuthenticated: !!storedToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      toast.success("Logged out successfully");
    },
    clearSession: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
    },
    clearError: (state) => {
      state.error = null;
    },
    setDemoMode: (state) => {
      state.isDemoMode = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        const { token, user } = normalizeAuthPayload(action.payload);
        state.loading = false;
        state.user = user;
        state.token = token;
        state.isAuthenticated = !!token;

        if (token) {
          localStorage.setItem("adminToken", token);
        }
        if (user) {
          localStorage.setItem("adminUser", JSON.stringify(user));
        }

        toast.success("Login successful!");
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        if (action.payload) {
          localStorage.setItem("adminUser", JSON.stringify(action.payload));
        }
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        if (action.payload) {
          localStorage.setItem("adminUser", JSON.stringify(action.payload));
        }
        toast.success("Profile updated successfully!");
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Change Password
      .addCase(changePassword.fulfilled, () => {
        toast.success("Password changed successfully!");
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { logout, clearSession, clearError, setDemoMode } =
  authSlice.actions;
export default authSlice.reducer;
