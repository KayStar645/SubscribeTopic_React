import { MenuItemType } from '@assets/types/menu';
import { TFunction } from 'i18next';
import { FaBoxesStacked, FaGear, FaHouseChimney } from 'react-icons/fa6';
import { PERMISSION, ROUTES } from '.';

const ADMIN_MENU = (t: TFunction, lng: string): MenuItemType[] => {
    return [
        {
            code: 'home',
            label: t('menu:home'),
            icon: <FaHouseChimney />,
            parent: 'home',
            to: `/${lng}/${ROUTES.admin.home}`,
            permission: '',
            checkPermission: true,
        },
        {
            code: 'master_data',
            label: t('menu:master_data'),
            parent: 'master_data',
            icon: <FaBoxesStacked />,
            to: '',
            permission: '',
            checkPermission: true,
            items: [
                {
                    code: 'faculty',
                    parent: 'master_data',
                    label: t('menu:faculty'),
                    to: `/${lng}/${ROUTES.admin.faculty}`,
                    permission: PERMISSION.faculty.view,
                    checkPermission: true,
                },
                {
                    code: 'industry',
                    parent: 'master_data',
                    label: t('menu:industry'),
                    to: `/${lng}/${ROUTES.admin.industry}`,
                    permission: PERMISSION.industry.view,
                    checkPermission: true,
                },
                {
                    code: 'major',
                    parent: 'master_data',
                    label: t('menu:major'),
                    to: `/${lng}/${ROUTES.admin.major}`,
                    permission: PERMISSION.major.view,
                    checkPermission: true,
                },
                {
                    code: 'department',
                    parent: 'master_data',
                    label: t('menu:department'),
                    to: `/${lng}/${ROUTES.admin.department}`,
                    permission: PERMISSION.department.view,
                    checkPermission: true,
                },
                {
                    code: 'teacher',
                    parent: 'master_data',
                    label: t('menu:teacher'),
                    to: `/${lng}/${ROUTES.admin.teacher}`,
                    permission: PERMISSION.teacher.view,
                    checkPermission: true,
                },
                {
                    code: 'student',
                    parent: 'master_data',
                    label: t('menu:student'),
                    to: `/${lng}/${ROUTES.admin.student}`,
                    permission: PERMISSION.student.view,
                    checkPermission: true,
                },
                {
                    code: 'registration_period',
                    parent: 'master_data',
                    label: t('menu:registration_period'),
                    to: `/${lng}/${ROUTES.admin.registration_period}`,
                    permission: PERMISSION.registrationPeriod.view,
                    checkPermission: true,
                },
                {
                    code: 'student_join',
                    parent: 'master_data',
                    label: t('menu:student_join'),
                    to: `/${lng}/${ROUTES.admin.student_join}`,
                    permission: PERMISSION.studentJoin.view,
                    checkPermission: true,
                },
                {
                    code: 'notification',
                    parent: 'master_data',
                    label: t('menu:notification'),
                    to: `/${lng}/${ROUTES.admin.notification}`,
                    permission: PERMISSION.notification.view,
                    checkPermission: true,
                },
                {
                    code: 'group',
                    parent: 'master_data',
                    label: t('menu:group'),
                    to: `/${lng}/${ROUTES.admin.group}`,
                    permission: PERMISSION.group.view,
                    checkPermission: true,
                },
                {
                    code: 'thesis',
                    parent: 'master_data',
                    label: t('menu:thesis'),
                    to: `/${lng}/${ROUTES.admin.thesis}`,
                    permission: PERMISSION.thesis.view,
                    checkPermission: true,
                },
            ],
        },
        {
            code: 'system',
            label: t('menu:system'),
            parent: 'system',
            icon: <FaGear />,
            permission: '',
            checkPermission: true,
            to: '',
            items: [
                {
                    code: 'role',
                    label: t('menu:role'),
                    parent: 'system',
                    permission: PERMISSION.faculty.view,
                    checkPermission: true,
                    to: `/${lng}/${ROUTES.admin.role}`,
                },
                {
                    code: 'user',
                    label: t('menu:user'),
                    parent: 'system',
                    permission: PERMISSION.permission.view,
                    checkPermission: true,
                    to: `/${lng}/${ROUTES.admin.user}`,
                },
            ],
        },
    ];
};

export { ADMIN_MENU };
