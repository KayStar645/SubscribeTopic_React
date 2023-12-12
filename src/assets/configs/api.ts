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
        google_drive: '/googledrive',
        feedback: '/feedback',
        job: '/job',
        exchange: 'exchange',
        duty: '/duty',

        detail: {
            notification: '/notification/detail',
            duty: '/duty/detail',
            group: '/group/detail',
            topic: '/thesis/detail',
            role: '/role/detail',
            job: '/job/detail',
            exchange: '/exchange/detail',
        },

        approve: {
            topic: 'thesis/changeStatus',
        },

        assign: {
            role: '/role/assign',
        },

        custom: {
            thesis: {
                topic_by_teacher: '/thesis/listThesisInstructorOfTeacher',
            },
        },
    },
};

export { API };
