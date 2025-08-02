import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LayoutState {
  isSidebarOpen: boolean;
  isProfileOpen: boolean;
  walletAddress: string;
  oldPassword: string;
  newPassword: string;
  activeTab: string;
  walletSaved: boolean;
}

const initialState: LayoutState = {
  isSidebarOpen: false,
  isProfileOpen: false,
  walletAddress: "",
  oldPassword: "",
  newPassword: "",
  activeTab: "dashboard",
  walletSaved: false,
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebar(state, action: PayloadAction<boolean>) {
      state.isSidebarOpen = action.payload;
    },
    toggleProfile(state) {
      state.isProfileOpen = !state.isProfileOpen;
    },
    setProfile(state, action: PayloadAction<boolean>) {
      state.isProfileOpen = action.payload;
    },
    setWalletSaved(state, action: PayloadAction<boolean>) {
      state.walletSaved = action.payload;
    },
    setWalletAddress(state, action: PayloadAction<string>) {
      state.walletAddress = action.payload;
    },
    setOldPassword(state, action: PayloadAction<string>) {
      state.oldPassword = action.payload;
    },
    setNewPassword(state, action: PayloadAction<string>) {
      state.newPassword = action.payload;
    },
    setActiveTab(state, action: PayloadAction<string>) {
      state.activeTab = action.payload;
    },
    resetPasswordFields(state) {
      state.oldPassword = "";
      state.newPassword = "";
    },
    resetLayoutState: () => initialState, 
  },
});

export const {
  toggleSidebar,
  setSidebar,
  toggleProfile,
  setProfile,
  setWalletAddress,
  setWalletSaved,
  setOldPassword,
  setNewPassword,
  setActiveTab,
  resetPasswordFields,
  resetLayoutState,
} = layoutSlice.actions;

export default layoutSlice.reducer;
