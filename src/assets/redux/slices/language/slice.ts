import { LanguageSliceType } from '@assets/types/slice';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: LanguageSliceType = {
	currLanguage: 'vi',
};

const languageSlice = createSlice({
	name: 'language',
	initialState,
	reducers: {
		setLanguage: (state, action: PayloadAction<LanguageSliceType>) => {
			state.currLanguage = action.payload.currLanguage;
		},
	},
	extraReducers: (builder) => {
		builder;
	},
});

export default languageSlice;
