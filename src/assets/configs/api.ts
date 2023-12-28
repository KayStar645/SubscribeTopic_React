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
        job_result: '/jobResults',
        schedule: '/reportSchedule',
        department_duty: '/departmentDuty',
        point: '/point',
        council: '/council',

        detail: {
            notification: '/notification/detail',
            duty: '/duty/detail',
            group: '/group/detail',
            topic: '/thesis/detail',
            role: '/role/detail',
            job: '/job/detail',
            exchange: '/exchange/detail',
            schedule: '/reportSchedule/detail',
            department_duty: '/departmentDuty/detail',
            point: '/point',
            council: '/council/detail',
            teacher: '/teacher/detail',
        },

        change_status: {
            topic: '/thesis/changeStatus',
        },

        approve: {
            topic: '/thesis/approve',
        },

        assign: {
            role: '/role/assign',
        },

        custom: {
            thesis: {
                topic_by_teacher: '/thesis/listThesisInstructorOfTeacher',
                topic_counter_by_teacher: '/thesis/listThesisReviewOfTeacher',
                send_to_council: '/thesis/approveToCouncil',
                topic_by_council: '/thesis/listthesispossiblecouncil',
            },
            point: {
                by_thesis: '/point/thesis',
                by_faculty: '/point/faculty',
            },
            council: {
                select_thesis: '/council/selectThesis',
            },
        },
    },
};

export { API };
