interface MenuItemProps {
	code: string;
	label: string;
	items?: MenuItemProps[];
	icon?: string;
	to?: string;
	itemClassName?: string;
	labelClassName?: string;
	iconClassName?: string;
}

export type { MenuItemProps };
