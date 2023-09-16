module.exports = {
	locales: ['en', 'vi'],
	defaultLocale: 'vi',
	defaultNS: 'common',
	pages: {
		'*': ['common', 'validation', 'info'],
	},
	loadLocaleFrom: (lang, ns) => import(`./src/resources/locales/${lang}/${ns}.json`).then((m) => m.default),
};
