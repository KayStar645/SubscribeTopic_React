const API = {
    auth: {
        sign_in: '/account/login',
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
        thesis: '/thesis',
        role: '/role',
        permission: '/permission',

        detail: {
            notification: '/notification/detail',
            group: '/group/detail',
            thesis: '/thesis/detail',
            role: '/role/detail',
        },
    },
};

export { API };
