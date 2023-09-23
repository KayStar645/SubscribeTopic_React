import React from 'react';

interface MenuItemType {
	parent?: string;
	isChild?: boolean;
	code: string;
	label: string;
	items?: MenuItemType[];
	icon?: React.JSX.Element;
	to?: string;
	itemClassName?: string;
	labelClassName?: string;
	iconClassName?: string;
	isOpenMenu?: boolean;
	onItemClick?: (item: MenuItemType) => void;
}

export type { MenuItemType };
