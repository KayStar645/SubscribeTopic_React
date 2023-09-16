import { signInType } from '@assets/types/slice';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: signInType = {
	account: '',
	password: '',
	token: '',
	remember_password: false,
	status: 'idle',
};

export const signInSlice = createSlice({
	name: 'sign-in',
	initialState,
	reducers: {
		signIn: (state, action: PayloadAction<signInType>) => {
			return { ...state, ...action.payload, status: 'success' };
		},
	},
	extraReducers: (builder) => {
		builder;
	},
});
