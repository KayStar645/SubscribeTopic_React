import { OptionType } from './common';

interface signInSliceType {
	account: string;
	password: string;
	rememberPassword: boolean;
	token?: string;
	userName: string;
}

interface MenuSliceType {
	activeItem: string;
}

interface LanguageSliceType {
	currLanguage: string;
}

export type { signInSliceType, MenuSliceType, LanguageSliceType };
