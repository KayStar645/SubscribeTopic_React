import { MenuSliceType } from '@assets/types/slice';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: MenuSliceType = {
    activeItem: 'home',
    parent: '',
    openMenu: false,
};

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        onItemClick: (state, action: PayloadAction<MenuSliceType>) => {
            state.activeItem = action.payload.activeItem;
            state.openMenu = action.payload.openMenu;
            state.parent = action.payload.parent;
        },
    },
    extraReducers: (_builder) => {},
});

export default menuSlice;
