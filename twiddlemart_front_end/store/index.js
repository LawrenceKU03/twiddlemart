import { configureStore } from "@reduxjs/toolkit";
import NavbarReducer from "../Components/Navbar/Navbar.slice";
import ArticlesReducer from "../Components/Articles/Articles.slice";
import StoreReducer from "../Components/StorePage/Store.slice";

export const store = configureStore({
	reducer: {
		Navbar: NavbarReducer,
		Articles: ArticlesReducer,
		Store: StoreReducer,
	},
});
