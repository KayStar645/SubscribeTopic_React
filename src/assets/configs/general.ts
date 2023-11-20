import { OptionType } from '@assets/types/common';
import { TFunction } from 'i18next';

const GENDER = (t: TFunction): OptionType[] => [
    {
        label: t('male'),
        value: t('male'),
    },
    {
        label: t('female'),
        value: t('female'),
    },
    {
        label: t('other'),
        value: t('other'),
    },
];

const SEMESTER = (t: TFunction): OptionType[] => [
    {
        label: t('semester', { number: 1 }),
        value: t('semester', { number: 1 }),
    },
    {
        label: t('semester', { number: 2 }),
        value: t('semester', { number: 2 }),
    },
    {
        label: t('semester', { number: 3 }),
        value: t('semester', { number: 3 }),
    },
];

const DATE_FILTER = (t: TFunction): OptionType[] => [
    {
        label: t('request:filter_date_created_down'),
        value: 0,
        name: 'DateCreated',
        code: 'date_decrease',
    },
    {
        label: t('request:filter_date_created_up'),
        value: 1,
        name: 'DateCreated',
        code: 'date_increase',
    },
];

const ACADEMIC = (t: TFunction): OptionType[] => [
    {
        label: t('info:academic.bachelor'),
        value: t('info:academic.bachelor'),
    },
    {
        label: t('info:academic.engineer'),
        value: t('info:academic.engineer'),
    },
    {
        label: t('info:academic.master'),
        value: t('info:academic.master'),
    },
    {
        label: t('info:academic.doctor'),
        value: t('info:academic.doctor'),
    },
];

const DEGREE = (t: TFunction): OptionType[] => [
    {
        label: t('info:degree.associate_professor'),
        value: t('info:degree.associate_professor'),
    },
    {
        label: t('info:degree.professor'),
        value: t('info:degree.professor'),
    },
];

const USER_TYPE = (t: TFunction): OptionType[] => [
    {
        label: t('info:employee_type.teacher'),
        value: 'L',
    },
    {
        label: t('info:employee_type.ministry'),
        value: 'M',
    },
];

const THESIS_STATUS = (t: TFunction) => ({
    A: t('common:approve'),
    AR: t('common:approve_request'),
    D: t('common:draft'),
});

export { GENDER, SEMESTER, DATE_FILTER, ACADEMIC, DEGREE, USER_TYPE, THESIS_STATUS };
