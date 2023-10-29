import { OptionType } from '@assets/types/common';
import { TFunction } from 'i18next';

const genders = (t: TFunction): OptionType[] => [
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

const semesters = (t: TFunction): OptionType[] => [
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

const dateFilters = (t: TFunction): OptionType[] => [
    {
        label: `${t('filter_date_created_down')}`,
        value: 0,
        name: 'DateCreated',
        code: 'date_decrease',
    },
    {
        label: `${t('filter_date_created_up')}`,
        value: 1,
        name: 'DateCreated',
        code: 'date_increase',
    },
];

export { genders, semesters, dateFilters };
