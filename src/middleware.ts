import { NextRequest, NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';
import { COOKIE_LANGUAGE_NAME, LANGUAGE, LANGUAGES, LANGUAGE_EXPIRE, AUTH_RAW_TOKEN, ROUTES } from '@assets/configs';

const languages = LANGUAGES.map((t) => t.value) as string[];

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

    if (!req.cookies.has(AUTH_RAW_TOKEN) && !req.url.includes(ROUTES.auth.sign_in)) {
        return NextResponse.redirect(new URL(`/vi${ROUTES.auth.sign_in}`, req.url));
    }

    if (
        !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
        !req.nextUrl.pathname.startsWith('/_next')
    ) {
        let response = NextResponse.redirect(new URL(`/${lng}${ROUTES.auth.sign_in}${req.nextUrl.pathname}`, req.url));

        if (req.cookies.has(AUTH_RAW_TOKEN)) {
            response = NextResponse.redirect(new URL(`/${lng}${ROUTES.admin.home}${req.nextUrl.pathname}`, req.url));
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

    // return NextResponse.next();
}
