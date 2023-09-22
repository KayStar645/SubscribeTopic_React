import React from 'react';

interface MenuItemType {
	code: string;
	label: string;
	items?: MenuItemType[];
	icon?: React.JSX.Element;
	to?: string;
	itemClassName?: string;
	labelClassName?: string;
	iconClassName?: string;
	onItemClick?: (item: MenuItemType) => void;
}

export type { MenuItemType };
