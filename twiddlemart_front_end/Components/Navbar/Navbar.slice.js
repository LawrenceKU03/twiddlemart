import { createSlice } from "@reduxjs/toolkit";
import jwt_decode from "jwt-decode";

const initialState = {
  isAuthenticated: false,
  isactiveStore: false,
  isdarkMode: false,
  isactivePage: "home",
  tempCurrentPage: "home",
  authTokens: null,
  user: null,
  showSearchBar: false,
  isShowProducts: true,
  isShowArticles: true,
  isAccountKillDay: false,
  isLoading: false,
  isFiltered: false,
};

const navbarSlice = createSlice({
  name: "Navbar",
  initialState: initialState,
  reducers: {
    setIsLoading: (state, { payload }) => {
      state.isLoading = payload.isloading;
    },
    toggleDarkmode: (state) => {
      state.isdarkMode = !state.isdarkMode;
    },
    setActivePage: (state, { payload }) => {
      if (state.isactivePage == payload.page_name) {
        return;
      }
      state.isactivePage = payload.page_name;
    },
    setTempCurrentPage: (state, { payload }) => {
      if (state.tempCurrentPage == payload.page_name) {
        return;
      }
      state.tempCurrentPage = payload.page_name;
    },
    toggleStoreVisible: (state, { payload }) => {
      state.isactiveStore = payload.isactiveStore;
    },
    setAuthTokens: (state, { payload }) => {
      if (!state.isAuthenticated) {
        state.authTokens = payload.authTokens;
        state.isAuthenticated = !state.isAuthenticated;

        localStorage.setItem("authTokens", JSON.stringify(state.authTokens));
        state.user = jwt_decode(payload.authTokens.access);
      }
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.authTokens = null;
      localStorage.removeItem("authTokens");
    },
    setIsFiltered: (state, { payload }) => {
      state.isFiltered = payload.is_filtered;
    },
    setShowProducts: (state, { payload }) => {
      state.isShowProducts = payload.show_products;
    },
    setShowArticles: (state, { payload }) => {
      state.isShowArticles = payload.show_articles;
    },
    setAccountKillDay: (state, { payload }) => {
      state.isAccountKillDay = payload.isKillDay;
    },
  },
});

export const {
  setAuthTokens,
  setActivePage,
  toggleDarkmode,
  toggleStoreVisible,
  logoutUser,
  setShowProducts,
  setShowArticles,
  setAccountKillDay,
  setIsLoading,
  setTempCurrentPage,
  setIsFiltered,
} = navbarSlice.actions;

export default navbarSlice.reducer;
