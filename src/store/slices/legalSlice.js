import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { legalAPI } from "../../utils/api";

// Async thunks
export const fetchLegalContent = createAsyncThunk(
  "legal/fetchLegalContent",
  async (_, { rejectWithValue }) => {
    try {
      const response = await legalAPI.getAll();
      // Support both { data } wrapper and direct body
      const data = response.data?.data ?? response.data;
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch legal content",
      );
    }
  },
);

export const updateLegalContent = createAsyncThunk(
  "legal/updateLegalContent",
  async ({ type, content }, { rejectWithValue }) => {
    try {
      const response = await legalAPI.update(type, { content });
      // Support both { data: { content, lastUpdated } } and direct { content, lastUpdated }
      const data = response.data?.data ?? response.data;
      const resolvedContent =
        data?.content ?? data?.data?.content ?? content;
      const contentStr =
        typeof resolvedContent === "string"
          ? resolvedContent
          : resolvedContent != null
            ? String(resolvedContent)
            : "";
      const lastUpdated =
        data?.lastUpdated ?? data?.data?.lastUpdated ?? new Date().toISOString();
      return { content: contentStr, lastUpdated };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update legal content",
      );
    }
  },
);

const initialState = {
  privacyPolicy: {
    content: "",
    lastUpdated: null,
    isLoading: false,
    error: null,
  },
  termsOfService: {
    content: "",
    lastUpdated: null,
    isLoading: false,
    error: null,
  },
  cookiePolicy: {
    content: "",
    lastUpdated: null,
    isLoading: false,
    error: null,
  },
  aboutUs: {
    content: "",
    lastUpdated: null,
    isLoading: false,
    error: null,
  },
  globalLoading: false,
  globalError: null,
};

const legalSlice = createSlice({
  name: "legal",
  initialState,
  reducers: {
    clearLegalErrors: (state) => {
      state.globalError = null;
      state.privacyPolicy.error = null;
      state.termsOfService.error = null;
      state.cookiePolicy.error = null;
    },
    setLegalContent: (state, action) => {
      const { type, content } = action.payload;
      if (state[type]) {
        state[type].content = content;
      }
    },
    resetLegalState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch legal content
      .addCase(fetchLegalContent.pending, (state) => {
        state.globalLoading = true;
        state.globalError = null;
      })
      .addCase(fetchLegalContent.fulfilled, (state, action) => {
        state.globalLoading = false;
        const { privacyPolicy, termsOfService, cookiePolicy, aboutUs } =
          action.payload;

        if (privacyPolicy) {
          state.privacyPolicy.content = privacyPolicy.content;
          state.privacyPolicy.lastUpdated = privacyPolicy.lastUpdated;
        }
        if (termsOfService) {
          state.termsOfService.content = termsOfService.content;
          state.termsOfService.lastUpdated = termsOfService.lastUpdated;
        }
        if (cookiePolicy) {
          state.cookiePolicy.content = cookiePolicy.content;
          state.cookiePolicy.lastUpdated = cookiePolicy.lastUpdated;
        }
        if (aboutUs) {
          state.aboutUs.content = aboutUs.content;
          state.aboutUs.lastUpdated = aboutUs.lastUpdated;
        }
      })
      .addCase(fetchLegalContent.rejected, (state, action) => {
        state.globalLoading = false;
        state.globalError = action.payload;
      })

      // Update legal content
      .addCase(updateLegalContent.pending, (state, action) => {
        const type = action.meta.arg.type;
        if (state[type]) {
          state[type].isLoading = true;
          state[type].error = null;
        }
      })
      .addCase(updateLegalContent.fulfilled, (state, action) => {
        const type = action.meta.arg.type;
        if (state[type]) {
          state[type].isLoading = false;
          const { content, lastUpdated } = action.payload;
          if (content !== undefined) state[type].content = typeof content === "string" ? content : String(content ?? "");
          if (lastUpdated !== undefined) state[type].lastUpdated = lastUpdated;
        }
      })
      .addCase(updateLegalContent.rejected, (state, action) => {
        const type = action.meta.arg.type;
        if (state[type]) {
          state[type].isLoading = false;
          state[type].error = action.payload;
        }
      });
  },
});

export const { clearLegalErrors, setLegalContent, resetLegalState } =
  legalSlice.actions;

export default legalSlice.reducer;
