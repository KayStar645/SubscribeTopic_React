import { NextRequest, NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';
import { COOKIE_LANGUAGE_NAME, LANGUAGE, LANGUAGES, LANGUAGE_EXPIRE, AUTH_TOKEN } from '@assets/configs';

const languages = LANGUAGES.map((t) => t.value);

acceptLanguage.languages(languages);

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)'],
    // matcher: ['/'],
};

export function middleware(req: NextRequest) {
    if (req.nextUrl.pathname.indexOf('icon') > -1 || req.nextUrl.pathname.indexOf('chrome') > -1) {
        return NextResponse.next();
    }

    let lng;

    if (req.cookies.has(COOKIE_LANGUAGE_NAME)) {
        lng = acceptLanguage.get(req.cookies.get(COOKIE_LANGUAGE_NAME)?.value || LANGUAGE.VI.value);
    }

    if (!lng) {
        lng = acceptLanguage.get(req.headers.get('Accept-Language'));
    }

    if (!req.cookies.has(AUTH_TOKEN) && !req.url.includes('/auth/sign-in')) {
        return NextResponse.redirect(new URL(`http://localhost:2222/vi/auth/sign-in`));
    }

    if (
        !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
        !req.nextUrl.pathname.startsWith('/_next')
    ) {
        let response = NextResponse.next();
        let user = req.cookies.has(AUTH_TOKEN) ? req.cookies.get(AUTH_TOKEN) : undefined;

        if (user) {
            let userJson = JSON.parse(user.value);

            if (userJson.roll === 'admin') {
                response = NextResponse.redirect(new URL(`/vi/home${req.nextUrl.pathname}`, req.url));
            } else if (userJson.roll === 'user') {
                response = NextResponse.redirect(new URL(`http://localhost:2222/vi/home`));
            }
        }

        return response;
    }

    if (req.headers.has('referer')) {
        const refererUrl = new URL(req.headers.get('referer')!);
        const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`));
        const response = NextResponse.next();

        if (lngInReferer) {
            response.cookies.set(COOKIE_LANGUAGE_NAME, lngInReferer, { maxAge: LANGUAGE_EXPIRE });
        }

        return response;
    }

    // return NextResponse.redirect(new URL('/vi/home', req.url));
}
