import { MenuItemType } from '@assets/types/menu';
import { TFunction } from 'i18next';
import { FaArrowRightArrowLeft, FaArrowRightFromBracket, FaUser } from 'react-icons/fa6';
import { LuLanguages } from 'react-icons/lu';
import { LANGUAGE, LANGUAGES, ROUTES } from '.';

const getUserMenu = (t: TFunction, lng: string, pathName: string): MenuItemType[] => {
    const currLanguage = LANGUAGE[lng.toUpperCase()].label || t('language');

    return [
        {
            code: 'logout',
            parent: 'logout',
            label: t('menu:logout'),
            icon: <FaArrowRightFromBracket />,
            to: `http://localhost:2222/vi/auth/sign-in`,
        },
    ];
};

export { getUserMenu };
