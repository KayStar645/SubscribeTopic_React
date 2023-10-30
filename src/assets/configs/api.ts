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

        detail: {
            notification: '/notification/detail',
            group: '/group/detail',
        },
    },
};

export { API };
