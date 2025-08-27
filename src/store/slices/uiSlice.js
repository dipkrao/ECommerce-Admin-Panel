import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: true,
  theme: 'light',
  notifications: [],
  modals: {
    productModal: false,
    categoryModal: false,
    orderModal: false,
    deleteConfirmModal: false,
  },
  loadingStates: {
    global: false,
    products: false,
    categories: false,
    orders: false,
  },
  searchQuery: '',
  selectedItems: [],
  viewMode: 'grid', // grid or list
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    openModal: (state, action) => {
      const { modalName } = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = true;
      }
    },
    closeModal: (state, action) => {
      const { modalName } = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = false;
      }
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((key) => {
        state.modals[key] = false;
      });
    },
    setLoadingState: (state, action) => {
      const { key, loading } = action.payload;
      if (state.loadingStates.hasOwnProperty(key)) {
        state.loadingStates[key] = loading;
      }
    },
    setGlobalLoading: (state, action) => {
      state.loadingStates.global = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearSearchQuery: (state) => {
      state.searchQuery = '';
    },
    setSelectedItems: (state, action) => {
      state.selectedItems = action.payload;
    },
    addSelectedItem: (state, action) => {
      if (!state.selectedItems.includes(action.payload)) {
        state.selectedItems.push(action.payload);
      }
    },
    removeSelectedItem: (state, action) => {
      state.selectedItems = state.selectedItems.filter(
        (item) => item !== action.payload
      );
    },
    clearSelectedItems: (state) => {
      state.selectedItems = [];
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    resetUI: (state) => {
      return { ...initialState, theme: state.theme }; // Keep theme preference
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleTheme,
  setTheme,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  closeAllModals,
  setLoadingState,
  setGlobalLoading,
  setSearchQuery,
  clearSearchQuery,
  setSelectedItems,
  addSelectedItem,
  removeSelectedItem,
  clearSelectedItems,
  setViewMode,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;
