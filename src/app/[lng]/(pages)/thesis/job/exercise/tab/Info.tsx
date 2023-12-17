import { AUTH_TOKEN } from '@assets/configs';
import { HTML } from '@assets/helpers/string';
import useCookies from '@assets/hooks/useCookies';
import { AuthType } from '@assets/interface';
import { Editor, InputDate, InputText } from '@resources/components/form';
import { useTranslation } from '@resources/i18n';
import moment from 'moment';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { useContext } from 'react';
import { Controller } from 'react-hook-form';
import { ExercisePageContext } from '../[id]/page';

const JobInfo = () => {
    const { id, lng, control, edit, job, setValue, getValues } = useContext(ExercisePageContext);
    const { t } = useTranslation(lng);
    const [auth] = useCookies<AuthType>(AUTH_TOKEN);

    return (
        <>
            <Button icon='pi pi-book' rounded={true} className='w-3rem h-3rem' />

            <div className='flex-1'>
                <div className={classNames('border-blue-700 pb-3')}>
                    <div className='flex gap-3'>
                        <div className='flex-1'>
                            {id == 0 || edit ? (
                                <Controller
                                    control={control}
                                    name='name'
                                    render={({ field, fieldState }) => (
                                        <InputText
                                            id='form_data_name'
                                            placeholder={t('common:name_of', {
                                                obj: t('module:job').toLowerCase(),
                                            })}
                                            onChange={field.onChange}
                                            value={field.value}
                                            errorMessage={fieldState.error?.message}
                                        />
                                    )}
                                />
                            ) : (
                                <p className='font-semibold text-3xl text-blue-700 mt-1'>{job?.name}</p>
                            )}
                        </div>
                    </div>

                    <div className='flex align-items-center justify-content-between my-3'>
                        <p className='text-sm text-700'>
                            {id > 0
                                ? job?.teacherBy?.name + ' • ' + moment(job?.lastModifiedDate).format('DD MMM')
                                : `${auth?.customer.Name} • ${moment().format('DD MMM')}`}
                        </p>

                        {id == 0 || edit ? (
                            <Controller
                                control={control}
                                name='due'
                                render={({ field }) => (
                                    <InputDate
                                        id='form_data_due'
                                        label={t('module:field.job.due')}
                                        placeholder={t('module:field.job.due')}
                                        time={true}
                                        row={true}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        ) : (
                            <p className='text-sm font-semibold text-900'>
                                Đến hạn {moment(job?.due).format('HH:mm DD MMM')}
                            </p>
                        )}
                    </div>

                    <div>
                        {id == 0 || edit ? (
                            <Controller
                                control={control}
                                name='instructions'
                                render={({ field, fieldState }) => (
                                    <Editor
                                        id='form_data_description'
                                        placeholder={t('common:summary')}
                                        value={field.value}
                                        disabled={id > 0 && !edit}
                                        onChange={(e) => setValue?.('instructions', e)}
                                        errorMessage={fieldState.error?.message}
                                    />
                                )}
                            />
                        ) : (
                            <div dangerouslySetInnerHTML={HTML(getValues?.('instructions'))} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default JobInfo;
