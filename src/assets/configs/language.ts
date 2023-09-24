import { OptionType } from '@assets/types/common';

type LanguageType = {
	[key: string]: {
		label: string;
		value: string;
	};
};

const LANGUAGES: OptionType[] = [
	{
		label: 'Tiếng Việt',
		value: 'vi',
		code: 'vi',
	},
	{
		label: 'English',
		value: 'en',
		code: 'en',
	},
];

const LANGUAGE: LanguageType = {
	VI: {
		label: 'Tiếng Việt',
		value: 'vi',
	},
	EN: {
		label: 'English',
		value: 'en',
	},
};

const NAMESPACE = {
	common: 'common',
	validation: 'validation',
	info: 'info',
};

const COOKIE_LANGUAGE_NAME = 'i18next';

export { COOKIE_LANGUAGE_NAME, LANGUAGE, LANGUAGES, NAMESPACE };
