import { MenuItemProps } from '@assets/types/menu';

const menu: MenuItemProps[] = [
	{
		code: 'master_data',
		label: 'Dữ liệu nguồn',
		icon: 'pi pi-fw pi-home',
		items: [
			{ code: 'product', label: 'Sản phẩm', to: '/blocks' },
			{
				code: 'product_category',
				label: 'Nhóm sản phẩm',
				to: 'https://blocks.primereact.org',
			},
		],
	},
	{
		code: 'home',
		label: 'Trang chủ',
		icon: 'pi pi-fw pi-home',
		to: '/home',
	},
	// {
	// 	code: 'home',label: 'Prime Blocks',
	// 	items: [
	// 		{ code: 'home',label: 'Free Blocks', icon: 'pi pi-fw pi-eye', to: '/blocks' },
	// 		{
	// 			code: 'home',label: 'All Blocks',
	// 			icon: 'pi pi-fw pi-globe',
	// 			to: 'https://blocks.primereact.org',
	// 		},
	// 	],
	// },
	// {
	// 	code: 'home',label: 'Utilities',
	// 	items: [
	// 		{ code: 'home',label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', to: '/utilities/icons' },
	// 		{
	// 			code: 'home',label: 'PrimeFlex',
	// 			icon: 'pi pi-fw pi-desktop',
	// 			to: 'https://primeflex.org/',
	// 		},
	// 	],
	// },
	// {
	// 	code: 'home',label: 'Pages',
	// 	icon: 'pi pi-fw pi-briefcase',
	// 	to: '/pages',
	// 	items: [
	// 		{
	// 			code: 'home',label: 'Landing',
	// 			icon: 'pi pi-fw pi-globe',
	// 			to: '/landing',
	// 		},
	// 		{
	// 			code: 'home',label: 'Auth',
	// 			icon: 'pi pi-fw pi-user',
	// 			items: [
	// 				{
	// 					code: 'home',label: 'Login',
	// 					icon: 'pi pi-fw pi-sign-in',
	// 					to: '/auth/login',
	// 				},
	// 				{
	// 					code: 'home',label: 'Error',
	// 					icon: 'pi pi-fw pi-times-circle',
	// 					to: '/auth/error',
	// 				},
	// 				{
	// 					code: 'home',label: 'Access Denied',
	// 					icon: 'pi pi-fw pi-lock',
	// 					to: '/auth/access',
	// 				},
	// 			],
	// 		},
	// 		{
	// 			code: 'home',label: 'Crud',
	// 			icon: 'pi pi-fw pi-pencil',
	// 			to: '/pages/crud',
	// 		},
	// 		{
	// 			code: 'home',label: 'Timeline',
	// 			icon: 'pi pi-fw pi-calendar',
	// 			to: '/pages/timeline',
	// 		},
	// 		{
	// 			code: 'home',label: 'Not Found',
	// 			icon: 'pi pi-fw pi-exclamation-circle',
	// 			to: '/pages/notfound',
	// 		},
	// 		{
	// 			code: 'home',label: 'Empty',
	// 			icon: 'pi pi-fw pi-circle-off',
	// 			to: '/pages/empty',
	// 		},
	// 	],
	// },
	// {
	// 	code: 'home',label: 'Hierarchy',
	// 	items: [
	// 		{
	// 			code: 'home',label: 'Submenu 1',
	// 			icon: 'pi pi-fw pi-bookmark',
	// 			items: [
	// 				{
	// 					code: 'home',label: 'Submenu 1.1',
	// 					icon: 'pi pi-fw pi-bookmark',
	// 					items: [
	// 						{ code: 'home',label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
	// 						{ code: 'home',label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
	// 						{ code: 'home',label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
	// 					],
	// 				},
	// 				{
	// 					code: 'home',label: 'Submenu 1.2',
	// 					icon: 'pi pi-fw pi-bookmark',
	// 					items: [{ code: 'home',label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }],
	// 				},
	// 			],
	// 		},
	// 		{
	// 			code: 'home',label: 'Submenu 2',
	// 			icon: 'pi pi-fw pi-bookmark',
	// 			items: [
	// 				{
	// 					code: 'home',label: 'Submenu 2.1',
	// 					icon: 'pi pi-fw pi-bookmark',
	// 					items: [
	// 						{ code: 'home',label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
	// 						{ code: 'home',label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' },
	// 					],
	// 				},
	// 				{
	// 					code: 'home',label: 'Submenu 2.2',
	// 					icon: 'pi pi-fw pi-bookmark',
	// 					items: [{ code: 'home',label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }],
	// 				},
	// 			],
	// 		},
	// 	],
	// },
	// {
	// 	code: 'home',label: 'Get Started',
	// 	items: [
	// 		{
	// 			code: 'home',label: 'Documentation',
	// 			icon: 'pi pi-fw pi-question',
	// 			to: '/documentation',
	// 		},
	// 		{
	// 			code: 'home',label: 'View Source',
	// 			icon: 'pi pi-fw pi-search',
	// 			to: 'https://github.com/primefaces/sakai-react',
	// 		},
	// 	],
	// },
];

export default menu;
