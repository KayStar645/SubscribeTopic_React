import { LANGUAGE, LANGUAGES, NAMESPACE } from '@assets/configs';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';

const initI18next = (lng = LANGUAGE.VI.value, ns = NAMESPACE.common) => {
	const i18nInstance = createInstance();

	i18nInstance.use(initReactI18next).init({
		resources: {
			en: {
				common: require('../../resources/i18n/locales/en/common.json'),
				validation: require('../../resources/i18n/locales/en/validation.json'),
				info: require('../../resources/i18n/locales/en/info.json'),
				route: require('../../resources/i18n/locales/en/route.json'),
				module: require('../../resources/i18n/locales/en/module.json'),
				menu: require('../../resources/i18n/locales/en/menu.json'),
			},
			vi: {
				common: require('../../resources/i18n/locales/vi/common.json'),
				validation: require('../../resources/i18n/locales/vi/validation.json'),
				info: require('../../resources/i18n/locales/vi/info.json'),
				route: require('../../resources/i18n/locales/vi/route.json'),
				module: require('../../resources/i18n/locales/vi/module.json'),
				menu: require('../../resources/i18n/locales/vi/menu.json'),
			},
		},
		lng,
		ns,
		supportedLngs: LANGUAGES.map((t) => t.value),
		defaultNS: NAMESPACE.common,
		fallbackLng: LANGUAGE.VI.value,
	});

	return i18nInstance;
};

export function useTranslation(_lng: string | undefined | null = LANGUAGE.VI.value, ns = NAMESPACE.common) {
	const lng = _lng || LANGUAGE.VI.value;
	const i18nextInstance = initI18next(lng, ns);

	return {
		t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns),
		i18n: i18nextInstance,
	};
}
