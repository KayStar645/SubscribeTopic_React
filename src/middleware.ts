import { storage } from '@assets/helpers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
	return NextResponse.redirect(new URL('home', request.url));
	// return NextResponse.redirect(new URL(`/auth/sign-in/${storage.get('language') || 'vi'}`, request.url));
}

export const config = {
	matcher: '/',
};
