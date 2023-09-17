import { MenuSliceType } from '@assets/types/slice';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: MenuSliceType = {
	activeItem: 'home',
};

const menuSlice = createSlice({
	name: 'menu',
	initialState,
	reducers: {
		onItemClick: (state, action: PayloadAction<MenuSliceType>) => {
			state.activeItem = action.payload.activeItem;
		},
	},
	extraReducers: (builder) => {
		builder;
	},
});

export default menuSlice;
