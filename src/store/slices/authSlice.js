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
      // If API fails, fall back to demo mode for testing
      if (
        credentials.email === "admin@example.com" &&
        credentials.password === "admin123"
      ) {
        const demoUser = {
          id: 1,
          name: "Admin User",
          email: "admin@example.com",
          username: "admin",
          role: "admin",
          avatar: "https://via.placeholder.com/40x40/3B82F6/FFFFFF?text=AU",
        };
        const demoToken = "demo-token-" + Date.now();
        return { token: demoToken, user: demoUser };
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

      if (token && !token.startsWith("demo-token-")) {
        const response = await authAPI.getProfile();
        return response.data;
      } else if (token && token.startsWith("demo-token-")) {
        // Demo mode fallback
        return {
          id: 1,
          name: "Admin User",
          email: "admin@example.com",
          username: "admin",
          role: "admin",
          avatar: "https://via.placeholder.com/40x40/3B82F6/FFFFFF?text=AU",
        };
      }
      throw new Error("No token available");
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

      if (token && !token.startsWith("demo-token-")) {
        const response = await authAPI.updateProfile(profileData);
        return response.data.user;
      } else {
        // Demo mode fallback
        const currentUser = state.auth.user;
        return { ...currentUser, ...profileData };
      }
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

      if (token && !token.startsWith("demo-token-")) {
        await authAPI.changePassword(passwordData);
        return true;
      } else {
        // Demo mode fallback
        if (passwordData.currentPassword === "admin123") {
          return true;
        } else {
          throw new Error("Current password is incorrect");
        }
      }
    } catch (error) {
      return rejectWithValue(error.message || "Password change failed");
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem("adminToken"),
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("adminToken"),
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
      toast.success("Logged out successfully");
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
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem("adminToken", action.payload.token);

        if (action.payload.token.startsWith("demo-token-")) {
          toast.success("Login successful! (Demo mode)");
        } else {
          toast.success("Login successful!");
        }
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
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        if (state.token) {
          state.token = null;
          state.isAuthenticated = false;
          localStorage.removeItem("adminToken");
        }
      })

      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        if (state.token && !state.token.startsWith("demo-token-")) {
          toast.success("Profile updated successfully!");
        } else {
          toast.success("Profile updated successfully! (Demo mode)");
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Change Password
      .addCase(changePassword.fulfilled, (state) => {
        if (state.token && !state.token.startsWith("demo-token-")) {
          toast.success("Password changed successfully!");
        } else {
          toast.success("Password changed successfully! (Demo mode)");
        }
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { logout, clearError, setDemoMode } = authSlice.actions;
export default authSlice.reducer;
