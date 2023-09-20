import { signInSliceType } from '@assets/types/slice';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: signInSliceType = {
	account: '',
	password: '',
	token: '',
	rememberPassword: false,
	userName: '',
};

const signInSlice = createSlice({
	name: 'sign-in',
	initialState,
	reducers: {
		signIn: (state, action: PayloadAction<signInSliceType>) => {
			return { ...state, ...action.payload };
		},
	},
	extraReducers: (builder) => {
		builder;
	},
});

export default signInSlice;
