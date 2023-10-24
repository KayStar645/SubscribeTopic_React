import { NextRequest, NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';
import { COOKIE_LANGUAGE_NAME, LANGUAGE, LANGUAGES, LANGUAGE_EXPIRE, AUTH_TOKEN } from '@assets/configs';

const languages = LANGUAGES.map((t) => t.value);

acceptLanguage.languages(languages);

export const config = {
    // matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)'],
    matcher: ['/'],
};

export function middleware(req: NextRequest) {
    // if (req.nextUrl.pathname.indexOf('icon') > -1 || req.nextUrl.pathname.indexOf('chrome') > -1) {
    // 	return NextResponse.next();
    // }

    // let lng;

    // if (req.cookies.has(COOKIE_LANGUAGE_NAME)) {
    // 	lng = acceptLanguage.get(req.cookies.get(COOKIE_LANGUAGE_NAME)?.value || LANGUAGE.VI.value);
    // }

    // if (!lng) {
    // 	lng = acceptLanguage.get(req.headers.get('Accept-Language'));
    // }

    // if (!req.cookies.has(AUTH_TOKEN) && !req.url.includes('/auth/sign-in')) {
    // 	return NextResponse.redirect(new URL(`/vi/auth/sign-in`, req.url));
    // }

    // if (
    // 	!languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    // 	!req.nextUrl.pathname.startsWith('/_next')
    // ) {
    // 	let route = NextResponse.redirect(new URL(`/${lng}/auth/sign-in${req.nextUrl.pathname}`, req.url));

    // 	if (req.cookies.has(AUTH_TOKEN)) {
    // 		route = NextResponse.redirect(new URL(`/${lng}/home${req.nextUrl.pathname}`, req.url));
    // 	}

    // 	return route;
    // }

    // if (req.headers.has('referer')) {
    // 	const refererUrl = new URL(req.headers.get('referer')!);
    // 	const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`));
    // 	const response = NextResponse.next();

    // 	if (lngInReferer) {
    // 		response.cookies.set(COOKIE_LANGUAGE_NAME, lngInReferer, { maxAge: LANGUAGE_EXPIRE });
    // 	}

    // 	return response;
    // }

    return NextResponse.redirect(new URL('/vi/home', req.url));
}
