const ROUTES = {
    base: 'https://localhost:7155/api',

    auth: {
        sign_in: '/auth/sign-in',
    },

    home: {
        index: '/home',
    },

    admin: {
        faculty: '/admin/faculty',
        department: '/admin/department',
        major: '/admin/major',
        industry: '/admin/industry',
    },

    master_data: {
        teacher: '/master_data/teacher',
        student: '/master_data/student',
        registration_period: '/master_data/registration_period',
        student_join: '/master_data/student_join',
    },

    thesis: {
        group: '/thesis/group',
        student_join: '/thesis/student_join',
        topic: '/thesis/topic',
    },

    information: {
        notification: '/information/notification',
    },

    system: {
        role: '/system/role',
        account: '/system/account',
    },
};

export { ROUTES };
