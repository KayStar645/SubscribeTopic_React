import { MenuItemType } from '@assets/types/menu';
import { TFunction } from 'i18next';
import { language } from '@assets/helpers';
import { FaBoxesStacked, FaHouseChimney } from 'react-icons/fa6';
import { ROUTES } from '.';

const getAdminMenu = (t: TFunction, lng: string): MenuItemType[] => {
	return [
		{
			code: 'home',
			label: t('menu:home'),
			icon: <FaHouseChimney />,
			to: language.addPrefixLanguage(lng, ROUTES.admin.home),
		},
		{
			code: 'master_data',
			label: t('menu:master_data'),
			icon: <FaBoxesStacked />,
			items: [
				{
					code: 'faculty',
					label: t('menu:faculty'),
					to: language.addPrefixLanguage(lng, ROUTES.admin.faculty),
				},
				{
					code: 'teacher',
					label: t('menu:teacher'),
					to: language.addPrefixLanguage(lng, ROUTES.admin.teacher),
				},
			],
		},
	];
};

export { getAdminMenu };
