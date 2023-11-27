const ROUTES = {
    base: 'https://localhost:7155/api',

    auth: {
        sign_in: '/auth/sign-in',
    },

    home: {
        index: '/home',
    },

    master_data: {
        teacher: '/master_data/teacher',
        faculty: '/master_data/faculty',
        department: '/master_data/department',
        major: '/master_data/major',
        industry: '/master_data/industry',
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
        faculty_duty: '/information/faculty_duty',
    },

    system: {
        role: '/system/role',
        account: '/system/account',
    },
};

export { ROUTES };
