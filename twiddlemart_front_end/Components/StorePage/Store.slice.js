import { createSlice } from "@reduxjs/toolkit";

const initialState={
	activeCategory:["general",-1]
};

const storeSlice=createSlice({
	name:"Store",
	initialState:initialState,
	reducers:{
		setActiveCategory:(state,{ payload }) =>{
			if(state.activeCategory[0]==payload.active_category[0]){
				return;
			}
		  state.activeCategory=payload.active_category;
		}
	}
});


export const { setActiveCategory }=storeSlice.actions;

export default storeSlice.reducer;



