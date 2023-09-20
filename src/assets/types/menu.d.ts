import React from 'react';

interface MenuItemProps {
	code: string;
	label: string;
	items?: MenuItemProps[];
	icon?: React.JSX.Element;
	to?: string;
	itemClassName?: string;
	labelClassName?: string;
	iconClassName?: string;
}

export type { MenuItemProps };
