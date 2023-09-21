import { ReactNode } from 'react';

interface PageProps {
	params: any;
	searchParams?: any;
	children?: ReactNode;
}

interface BreadcrumbProps {
	label: string;
	url: string;
	icon?: string;
}

interface LoaderProps {
	label?: string;
	show?: boolean;
}

export type { PageProps, BreadcrumbProps, LoaderProps };
