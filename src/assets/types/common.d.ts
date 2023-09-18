import React from 'react';

type OptionType = {
	label: string;
	value: string;
};

type PageProps = {
	params: any;
	searchParams?: any;
	children?: React.ReactNode;
};

type BreadcrumbType = {
	label: string;
	url: string;
	icon?: string;
};

export type { OptionType, PageProps, BreadcrumbType };
