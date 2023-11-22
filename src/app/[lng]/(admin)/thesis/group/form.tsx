import { API } from '@assets/configs';
import { request } from '@assets/helpers';
import { GroupParamType, GroupType, StudentType } from '@assets/interface';
import { LanguageType } from '@assets/types/lang';
import { Loader } from '@resources/components/UI';
import { useTranslation } from '@resources/i18n';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { Panel } from 'primereact/panel';
import { forwardRef, useImperativeHandle, useState } from 'react';

interface GroupFormRefType {
    show?: (_id?: number | string) => void;
    close?: () => void;
}

interface GroupFormType extends LanguageType {
    title: string;
}

const GroupForm = forwardRef<GroupFormRefType, GroupFormType>(({ title, lng }, ref) => {
    const [visible, setVisible] = useState(false);
    const { t } = useTranslation(lng);
    const [id, setId] = useState<string | number>(0);

    const groupDetailQuery = useQuery<GroupType | null, AxiosError<ResponseType>>({
        enabled: id != 0,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const params: GroupParamType = {
                id,
                isAllDetail: true,
            };

            const response = await request.get<GroupType>(API.admin.detail.group, { params });

            return response.data.data;
        },
    });

    const show = (id?: number | string) => {
        setVisible(true);

        if (id && id != 0) {
            setId(id);
        }
    };

    const close = () => {
        setVisible(false);
        setId(0);
    };

    const StudentInfo = ({ data }: { data?: StudentType }) => {
        return (
            <div className='flex flex-column gap-4'>
                <div className='flex align-items-center'>
                    <p className='w-14rem'>{t('common:name_of', { obj: t('module:student').toLowerCase() })}</p>
                    <p className='text-900 font-semibold'>{data?.name}</p>
                </div>

                <div className='flex align-items-center'>
                    <p className='w-14rem'>{t('module:field.student.class')}</p>
                    <p className='text-900 font-semibold'>{data?.class}</p>
                </div>

                <div className='flex align-items-center'>
                    <p className='w-14rem'>{t('phone_number')}</p>
                    <p className='text-900 font-semibold'>{data?.phoneNumber}</p>
                </div>

                <div className='flex align-items-center'>
                    <p className='w-14rem'>{t('email')}</p>
                    <p className='text-900 font-semibold'>{data?.email}</p>
                </div>
            </div>
        );
    };

    useImperativeHandle(ref, () => ({
        show,
        close,
    }));

    return (
        <Dialog
            header={title}
            visible={visible}
            style={{ width: '50vw' }}
            className='overflow-hidden relative'
            contentClassName='mb-8'
            onHide={close}
        >
            <Loader show={groupDetailQuery.isFetching} />

            {groupDetailQuery.data && (
                <div className='flex flex-column gap-4'>
                    <Panel header={t('module:field.group.leader')} toggleable={true}>
                        <StudentInfo data={groupDetailQuery.data?.leader.student} />
                    </Panel>

                    <Panel header={t('module:field.group.members')} toggleable={true} collapsed={true}>
                        {groupDetailQuery.data?.members?.map((t) => (
                            <div key={Math.random().toString()}>
                                <StudentInfo data={t.student} />
                                <Divider />
                            </div>
                        ))}
                    </Panel>
                </div>
            )}

            <div className='flex align-items-center gap-2 absolute bottom-0 left-0 right-0 bg-white p-4'>
                <Button label={t('back')} icon='pi pi-chevron-left' onClick={close} />
            </div>
        </Dialog>
    );
});

GroupForm.displayName = 'Group Form';

export default GroupForm;
export type { GroupFormRefType };
