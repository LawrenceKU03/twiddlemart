import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	activeCategory: ["general", -1,"general"],
};

const articlesSlice = createSlice({
	name: "Articles",
	initialState: initialState,
	reducers: {
		setActiveCategory: (state, { payload }) => {
			if(state.activeCategory[0]==payload.category_info[0]){
				return;
			}
			state.activeCategory = payload.category_info;
		},
	},
});

export const { setActiveCategory } = articlesSlice.actions;

export default articlesSlice.reducer;
