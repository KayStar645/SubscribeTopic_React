const ROUTES = {
    base: 'https://localhost:7155/api',

    auth: {
        sign_in: '/auth/sign-in',
    },

    home: {
        index: '/admin/home',
    },

    master_data: {
        teacher: '/admin/master_data/teacher',
        faculty: '/admin/master_data/faculty',
        department: '/admin/master_data/department',
        major: '/admin/master_data/major',
        industry: '/admin/master_data/industry',
        student: '/admin/master_data/student',
        registration_period: '/admin/master_data/registration_period',
        student_join: '/admin/master_data/student_join',
        notification: '/admin/master_data/notification',
    },

    system: {
        role: '/admin/system/role',
        user: '/admin/system/user',
    },

    thesis: {
        group: '/admin/thesis/group',
        student_join: '/admin/thesis/student_join',
        topic: '/admin/thesis/topic',
    },
};

export { ROUTES };
