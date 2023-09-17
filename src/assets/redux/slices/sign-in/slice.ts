import { signInSliceType } from '@assets/types/slice';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: signInSliceType = {
	account: '',
	password: '',
	token: '',
	remember_password: false,
	status: 'idle',
};

const signInSlice = createSlice({
	name: 'sign-in',
	initialState,
	reducers: {
		signIn: (state, action: PayloadAction<signInSliceType>) => {
			return { ...state, ...action.payload, status: 'success' };
		},
	},
	extraReducers: (builder) => {
		builder;
	},
});

export default signInSlice;
