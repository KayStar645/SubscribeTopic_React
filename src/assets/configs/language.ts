import { OptionType } from '@assets/types/common';
import { InitOptions } from 'i18next';

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

function getOptions(lng = LANGUAGE.VI.value, ns = NAMESPACE.common): InitOptions {
	return {
		resources: {
			en: {
				common: require('../../resources/i18n/locales/en/common.json'),
				validation: require('../../resources/i18n/locales/en/validation.json'),
				info: require('../../resources/i18n/locales/en/info.json'),
				route: require('../../resources/i18n/locales/en/route.json'),
			},
			vi: {
				common: require('../../resources/i18n/locales/vi/common.json'),
				validation: require('../../resources/i18n/locales/vi/validation.json'),
				info: require('../../resources/i18n/locales/vi/info.json'),
				route: require('../../resources/i18n/locales/vi/route.json'),
			},
		},
		lng,
		ns,
		supportedLngs: LANGUAGES.map((t) => t.value),
		defaultNS: NAMESPACE.common,
	};
}

export { LANGUAGE, LANGUAGES, COOKIE_LANGUAGE_NAME, NAMESPACE, getOptions };
