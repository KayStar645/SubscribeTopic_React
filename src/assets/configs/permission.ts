const PERMISSION = {
    faculty: {
        view: 'Faculty.View',
        create: 'Faculty.Create',
        update: 'Faculty.Update',
        delete: 'Faculty.Delete',
    },
    industry: {
        view: 'Industry.View',
        create: 'Industry.Create',
        update: 'Industry.Update',
        delete: 'Industry.Delete',
    },
    major: {
        view: 'Major.View',
        create: 'Major.Create',
        update: 'Major.Update',
        delete: 'Major.Delete',
    },
    department: {
        view: 'Department.View',
        create: 'Department.Create',
        update: 'Department.Update',
        delete: 'Department.Delete',
    },
    teacher: {
        view: 'Teacher.View',
        create: 'Teacher.Create',
        update: 'Teacher.Update',
        delete: 'Teacher.Delete',
    },
    student: {
        view: 'Student.View',
        create: 'Student.Create',
        update: 'Student.Update',
        delete: 'Student.Delete',
    },
    registrationPeriod: {
        view: 'RegistrationPeriod.View',
        create: 'RegistrationPeriod.Create',
        update: 'RegistrationPeriod.Update',
        delete: 'RegistrationPeriod.Delete',
    },
    studentJoin: {
        view: 'StudentJoin.View',
        create: 'StudentJoin.Create',
        update: 'StudentJoin.Update',
        delete: 'StudentJoin.Delete',
    },
    notification: {
        view: 'Notification.View',
        create: 'Notification.Create',
        update: 'Notification.Update',
        delete: 'Notification.Delete',
    },
    group: {
        view: 'Group.View',
        create: 'Group.Create',
        update: 'Group.Update',
        delete: 'Group.Delete',
    },
    topic: {
        view: 'Thesis.View',
        create: 'Thesis.Create',
        update: 'Thesis.Update',
        delete: 'Thesis.Delete',
    },
    role: {
        view: 'Role.View',
        create: 'Role.Create',
        update: 'Role.Update',
        delete: 'Role.Delete',
    },
    permission: {
        view: 'Permission.View',
    },
    account: {
        view: 'Account.View',
        create: 'Account.Create',
    },
};

const ACTION = {
    view: 'View',
    update: 'Update',
    create: 'Create',
    remove: 'Delete',
    change: 'Change',
};

export { PERMISSION, ACTION };
