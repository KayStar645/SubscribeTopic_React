const API = {
    auth: {
        sign_in: '/account/login',
        register: 'account/register',
    },

    admin: {
        faculty: '/faculty',
        teacher: '/teacher',
        department: '/department',
        major: '/major',
        industry: '/industry',
        student: '/student',
        registration_period: '/registrationPeriod',
        student_join: '/studentJoin',
        notification: '/notification',
        group: '/group',
        topic: '/thesis',
        role: '/role',
        permission: '/permission',
        account: '/account',
        google_drive: 'googledrive',
        feedback: 'feedback',

        detail: {
            notification: '/notification/detail',
            group: '/group/detail',
            topic: '/thesis/detail',
            role: '/role/detail',
        },

        approve: {
            topic: 'thesis/changeStatus',
        },

        assign: {
            role: '/role/assign',
        },
    },
};

export { API };
