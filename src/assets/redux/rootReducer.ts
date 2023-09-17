import menuSlice from './slices/menu/slice';
import { signInSlice } from './slices/sign-in';

export const reducer = {
	signIn: signInSlice.reducer,
	menu: menuSlice.reducer,
};
