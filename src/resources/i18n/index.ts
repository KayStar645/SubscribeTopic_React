import { LANGUAGE, NAMESPACE, getOptions } from '@assets/configs';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';

const initI18next = (lng = LANGUAGE.VI.value, ns = NAMESPACE.common) => {
	const i18nInstance = createInstance();

	i18nInstance.use(initReactI18next).init(getOptions(lng, ns));

	return i18nInstance;
};

export function useTranslation(_lng: string | undefined | null = LANGUAGE.VI.value, ns = NAMESPACE.common) {
	const lng = _lng || 'vi';
	const i18nextInstance = initI18next(lng, ns);

	return {
		t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns),
		i18n: i18nextInstance,
	};
}
