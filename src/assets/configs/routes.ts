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
        topic: '/thesis/topic',
        job: '/thesis/job',
        job_detail: '/thesis/job/group',
        job_for_topic: '/thesis/job/exercise',
        schedule: '/thesis/schedule',
        point: '/thesis/point',
        counter: '/thesis/counter',
    },

    information: {
        notification: '/information/notification',
        faculty_duty: '/information/faculty_duty',
        department_duty: '/information/department_duty',
    },

    system: {
        role: '/system/role',
        account: '/system/account',
    },
};

export { ROUTES };
