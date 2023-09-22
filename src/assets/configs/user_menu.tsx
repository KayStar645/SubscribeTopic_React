import { MenuItemType } from '@assets/types/menu';
import { TFunction } from 'i18next';
import { FaArrowRightFromBracket, FaUser } from 'react-icons/fa6';

const getUserMenu = (t: TFunction, lng: string): MenuItemType[] => {
	return [
		{
			code: 'info',
			label: t('menu:info'),
			icon: <FaUser />,
		},
		{
			code: 'logout',
			label: t('menu:logout'),
			icon: <FaArrowRightFromBracket />,
		},
	];
};

export { getUserMenu };
