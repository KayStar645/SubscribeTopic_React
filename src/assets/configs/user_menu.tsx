import { MenuItemType } from '@assets/types/menu';
import { TFunction } from 'i18next';
import { FaArrowRightArrowLeft, FaArrowRightFromBracket, FaUser } from 'react-icons/fa6';
import { LuLanguages } from 'react-icons/lu';
import { LANGUAGE, LANGUAGES, ROUTES } from '.';

const USER_MENU = (t: TFunction, lng: string, pathName: string): MenuItemType[] => {
    const currLanguage = LANGUAGE[lng.toUpperCase()].label || t('language');

    return [
        {
            code: 'info',
            parent: 'info',
            label: t('menu:info'),
            icon: <FaUser />,
            to: `/${lng}${pathName || '/home'}`,
        },
        {
            code: lng || 'language',
            parent: lng || 'language',
            label: currLanguage,
            icon: <LuLanguages />,
            items: LANGUAGES.map((t) => ({
                ...t,
                parent: 'language',
                to: `/${t.code}${pathName || '/home'}`,
            })),
        },
        {
            code: 'logout',
            parent: 'logout',
            label: t('menu:logout'),
            icon: <FaArrowRightFromBracket />,
            to: `/${lng}${ROUTES.auth.sign_in}`,
        },
        {
            code: 'change_faculty',
            parent: 'change_faculty',
            label: t('menu:change_faculty'),
            icon: <FaArrowRightArrowLeft />,
        },
    ];
};

export { USER_MENU };
