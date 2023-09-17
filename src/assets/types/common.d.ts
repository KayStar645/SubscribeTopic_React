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

export type { OptionType, PageProps };
