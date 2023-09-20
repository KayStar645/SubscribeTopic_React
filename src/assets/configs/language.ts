import { OptionType } from '@assets/types/common';

const LANGUAGES: OptionType[] = [
	{
		label: 'Tiếng Việt',
		value: 'vi',
	},
	{
		label: 'English',
		value: 'en',
	},
];

const LANGUAGE = {
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
