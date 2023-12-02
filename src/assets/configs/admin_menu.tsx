import { MenuItemType } from '@assets/types/menu';
import { TFunction } from 'i18next';
import { FaBookJournalWhills, FaBoxesStacked, FaGear, FaHouseChimney, FaRegNewspaper } from 'react-icons/fa6';
import { PERMISSION, ROUTES } from '.';

const ADMIN_MENU = (t: TFunction, lng: string): MenuItemType[] => {
    return [
        {
            code: 'home',
            label: t('menu:home'),
            icon: <FaHouseChimney />,
            parent: 'home',
            to: `/${lng}/${ROUTES.home.index}`,
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
                    to: `/${lng}/${ROUTES.master_data.faculty}`,
                    permission: PERMISSION.faculty.view,
                    checkPermission: true,
                },
                {
                    code: 'industry',
                    parent: 'master_data',
                    label: t('menu:industry'),
                    to: `/${lng}/${ROUTES.master_data.industry}`,
                    permission: PERMISSION.industry.view,
                    checkPermission: true,
                },
                {
                    code: 'major',
                    parent: 'master_data',
                    label: t('menu:major'),
                    to: `/${lng}/${ROUTES.master_data.major}`,
                    permission: PERMISSION.major.view,
                    checkPermission: true,
                },
                {
                    code: 'department',
                    parent: 'master_data',
                    label: t('menu:department'),
                    to: `/${lng}/${ROUTES.master_data.department}`,
                    permission: PERMISSION.department.view,
                    checkPermission: true,
                },
                {
                    code: 'teacher',
                    parent: 'master_data',
                    label: t('menu:teacher'),
                    to: `/${lng}/${ROUTES.master_data.teacher}`,
                    permission: PERMISSION.teacher.view,
                    checkPermission: true,
                },
                {
                    code: 'student',
                    parent: 'master_data',
                    label: t('menu:student'),
                    to: `/${lng}/${ROUTES.master_data.student}`,
                    permission: PERMISSION.student.view,
                    checkPermission: true,
                },
                {
                    code: 'registration_period',
                    parent: 'master_data',
                    label: t('menu:registration_period'),
                    to: `/${lng}/${ROUTES.master_data.registration_period}`,
                    permission: PERMISSION.registrationPeriod.view,
                    checkPermission: true,
                },
            ],
        },
        {
            code: 'thesis',
            label: t('menu:thesis'),
            parent: 'thesis',
            icon: <FaBookJournalWhills />,
            permission: '',
            checkPermission: true,
            to: '',
            items: [
                {
                    code: 'topic',
                    parent: 'thesis',
                    label: t('menu:topic'),
                    to: `/${lng}/${ROUTES.thesis.topic}`,
                    permission: PERMISSION.topic.view,
                    checkPermission: true,
                },
                {
                    code: 'group',
                    parent: 'thesis',
                    label: t('menu:group'),
                    to: `/${lng}/${ROUTES.thesis.group}`,
                    permission: PERMISSION.group.view,
                    checkPermission: true,
                },
                {
                    code: 'student_join',
                    parent: 'thesis',
                    label: t('menu:student_join'),
                    to: `/${lng}/${ROUTES.thesis.student_join}`,
                    permission: PERMISSION.studentJoin.view,
                    checkPermission: true,
                },
            ],
        },
        {
            code: 'information',
            label: t('menu:information'),
            parent: 'information',
            icon: <FaRegNewspaper />,
            permission: '',
            checkPermission: true,
            to: '',
            items: [
                {
                    code: 'notification',
                    label: t('menu:notification'),
                    parent: 'information',
                    permission: PERMISSION.faculty.view,
                    checkPermission: true,
                    to: `/${lng}/${ROUTES.information.notification}`,
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
                    permission: PERMISSION.role.view,
                    checkPermission: true,
                    to: `/${lng}/${ROUTES.system.role}`,
                },
                {
                    code: 'account',
                    label: t('menu:account'),
                    parent: 'system',
                    permission: PERMISSION.account.view,
                    checkPermission: true,
                    to: `/${lng}/${ROUTES.system.account}`,
                },
            ],
        },
    ];
};

export { ADMIN_MENU };
