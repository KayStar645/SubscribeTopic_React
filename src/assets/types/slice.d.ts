import { OptionType } from './common';

type signInSliceType = {
	account: string;
	password: string;
	remember_password: boolean;
	token?: string;
	status: 'idle' | 'checking' | 'success' | 'failed';
};

type MenuSliceType = {
	activeItem: string;
};

type LanguageSliceType = {
	currLanguage: string;
};

export type { signInSliceType, MenuSliceType, LanguageSliceType };
