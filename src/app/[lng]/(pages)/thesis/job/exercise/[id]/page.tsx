'use client';

import { AUTH_TOKEN } from '@assets/configs';
import useCookies from '@assets/hooks/useCookies';
import { AuthType } from '@assets/interface';
import { PageProps } from '@assets/types/UI';
import { Editor, InputDate, InputFile, InputText } from '@resources/components/form';
import { useTranslation } from '@resources/i18n';
import moment from 'moment';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils';
import { FaUserGroup } from 'react-icons/fa6';

const ExercisePage = ({ params }: PageProps) => {
    const { id, lng } = params;
    const { t } = useTranslation(lng);
    const [auth] = useCookies<AuthType>(AUTH_TOKEN);

    return (
        <div className='flex pr-2 gap-5'>
            <div className='flex-1'>
                <div className='flex gap-3'>
                    <Button icon='pi pi-book' rounded={true} className='w-3rem h-3rem' />

                    <div className='flex-1'>
                        <div
                            className={classNames('border-blue-700 pb-3', {
                                'border-bottom-1 ': id > 0,
                            })}
                        >
                            <div className='flex gap-3'>
                                <div className='flex-1'>
                                    {id == 0 ? (
                                        <InputText
                                            id='form_data_name'
                                            placeholder={t('common:name_of', { obj: t('module:job').toLowerCase() })}
                                        />
                                    ) : (
                                        <p className='font-semibold text-3xl text-blue-700 mt-1'>Bài tập đầu đời</p>
                                    )}
                                </div>

                                <Button icon='pi pi-ellipsis-v' outlined={true} className='text-900' rounded={true} />
                            </div>

                            <div className='flex align-items-center justify-content-between my-3'>
                                <p className='text-sm text-700'>
                                    {id > 0 ? 'as' : `${auth?.customer.Name} • ${moment().format('DD MMM')}`}
                                </p>

                                {id == 0 ? (
                                    <InputDate
                                        id='form_data_due'
                                        label={t('module:field.job.due')}
                                        placeholder={t('module:field.job.due')}
                                        time={true}
                                        row={true}
                                    />
                                ) : (
                                    <p className='text-sm font-semibold text-900'>Đến hạn 10:45 4 thg 11</p>
                                )}
                            </div>

                            <Editor id='form_data_description' placeholder={t('common:summary')} />
                        </div>

                        {id > 0 && (
                            <div className='mt-4 flex flex-column gap-3'>
                                <div className='flex align-items-center gap-3'>
                                    <FaUserGroup />
                                    <p className='text-900 font-semibold'>Nhận xét về lớp học</p>
                                </div>

                                <div className='flex gap-3'>
                                    <Avatar
                                        icon='pi pi-user'
                                        className='bg-primary text-white border-circle mt-1'
                                        size='normal'
                                    />

                                    <InputTextarea
                                        autoResize={true}
                                        rows={1}
                                        className='border-round-3xl flex-1 text-sm'
                                        placeholder='Thêm nhận xét trong lớp học'
                                    />

                                    <Button icon='pi pi-send' className='w-2rem h-2rem mt-1' rounded={true} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className='w-25rem'>
                <div className='flex flex-column gap-4'>
                    <div className='p-4 bg-white shadow-2 border-round'>
                        <div className='flex align-items-center gap-2 mb-3'>
                            <p className='text-xl font-semibold flex-1'>Tài liệu đi kèm</p>

                            <Button label='Thêm mới' size='small' />
                        </div>

                        <InputFile id='form_data_files' folder='test_cua_son_2/' fileClassName='col-12' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExercisePage;
