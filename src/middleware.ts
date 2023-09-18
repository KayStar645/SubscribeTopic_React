import { NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';
import { COOKIE_LANGUAGE_NAME, LANGUAGES } from '@assets/configs';

const languages = LANGUAGES.map((t) => t.value);

acceptLanguage.languages(languages);

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)'],
};

export function middleware(req: any) {
	if (req.nextUrl.pathname.indexOf('icon') > -1 || req.nextUrl.pathname.indexOf('chrome') > -1)
		return NextResponse.next();
	let lng;
	if (req.cookies.has(COOKIE_LANGUAGE_NAME))
		lng = acceptLanguage.get(req.cookies.get(COOKIE_LANGUAGE_NAME).value);
	if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'));

	if (
		!languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
		!req.nextUrl.pathname.startsWith('/_next')
	) {
		return NextResponse.redirect(new URL(`/${lng}/auth${req.nextUrl.pathname}`, req.url));
	}

	if (req.headers.has('referer')) {
		const refererUrl = new URL(req.headers.get('referer'));
		const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`));
		const response = NextResponse.next();
		if (lngInReferer) response.cookies.set(COOKIE_LANGUAGE_NAME, lngInReferer);
		return response;
	}

	return NextResponse.next();
}
