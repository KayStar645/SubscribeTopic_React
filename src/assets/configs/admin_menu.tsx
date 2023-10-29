import { MenuItemType } from '@assets/types/menu';
import { TFunction } from 'i18next';
import { FaBoxesStacked, FaHouseChimney } from 'react-icons/fa6';
import { ROUTES } from '.';

const getAdminMenu = (t: TFunction, lng: string): MenuItemType[] => {
    return [
        {
            code: 'home',
            label: t('menu:home'),
            icon: <FaHouseChimney />,
            parent: 'home',
            to: `/${lng}/${ROUTES.admin.home}`,
        },
        {
            code: 'master_data',
            label: t('menu:master_data'),
            parent: 'master_data',
            icon: <FaBoxesStacked />,
            items: [
                {
                    code: 'faculty',
                    parent: 'master_data',
                    label: t('menu:faculty'),
                    to: `/${lng}/${ROUTES.admin.faculty}`,
                },
                // {
                //     code: 'teacher',
                //     parent: 'master_data',
                //     label: t('menu:teacher'),
                //     to: `/${lng}/${ROUTES.admin.teacher}`,
                // },
                {
                    code: 'industry',
                    parent: 'master_data',
                    label: t('menu:industry'),
                    to: `/${lng}/${ROUTES.admin.industry}`,
                },
                {
                    code: 'major',
                    parent: 'master_data',
                    label: t('menu:major'),
                    to: `/${lng}/${ROUTES.admin.major}`,
                },
                {
                    code: 'department',
                    parent: 'master_data',
                    label: t('menu:department'),
                    to: `/${lng}/${ROUTES.admin.department}`,
                },
                {
                    code: 'student',
                    parent: 'master_data',
                    label: t('menu:student'),
                    to: `/${lng}/${ROUTES.admin.student}`,
                },
                {
                    code: 'registration_period',
                    parent: 'master_data',
                    label: t('menu:registration_period'),
                    to: `/${lng}/${ROUTES.admin.registration_period}`,
                },
                {
                    code: 'student_join',
                    parent: 'master_data',
                    label: t('menu:student_join'),
                    to: `/${lng}/${ROUTES.admin.student_join}`,
                },
                {
                    code: 'notification',
                    parent: 'master_data',
                    label: t('menu:notification'),
                    to: `/${lng}/${ROUTES.admin.notification}`,
                },
            ],
        },
    ];
};

export { getAdminMenu };
