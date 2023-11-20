import { GroupType, StudentType } from '@assets/interface';
import { LanguageType } from '@assets/types/lang';
import { useTranslation } from '@resources/i18n';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { Panel } from 'primereact/panel';
import { forwardRef, useImperativeHandle, useState } from 'react';

interface GroupFormRefType {
    show?: (data?: GroupType) => void;
    close?: () => void;
}

interface GroupFormType extends LanguageType {
    title: string;
}

const GroupForm = forwardRef<GroupFormRefType, GroupFormType>(({ title, lng }, ref) => {
    const [visible, setVisible] = useState(false);
    const [info, setInfo] = useState<GroupType>();
    const { t } = useTranslation(lng);

    const show = (data?: GroupType) => {
        setVisible(true);

        setInfo(data);
    };

    const close = () => {
        setVisible(false);
    };

    const StudentInfo = ({ data }: { data: StudentType }) => {
        return (
            <div className='flex flex-column gap-4'>
                <div className='flex align-items-center'>
                    <p className='w-10rem'>{t('common:name_of', { obj: t('module:student').toLowerCase() })}</p>
                    <p className='text-900 font-semibold'>{data.name}</p>
                </div>

                <div className='flex align-items-center'>
                    <p className='w-10rem'>{t('module:field.student.class')}</p>
                    <p className='text-900 font-semibold'>{data.class}</p>
                </div>

                <div className='flex align-items-center'>
                    <p className='w-10rem'>{t('phone_number')}</p>
                    <p className='text-900 font-semibold'>{data.phoneNumber}</p>
                </div>

                <div className='flex align-items-center'>
                    <p className='w-10rem'>{t('email')}</p>
                    <p className='text-900 font-semibold'>{data.email}</p>
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
            style={{ width: '70vw' }}
            className='overflow-hidden'
            contentClassName='mb-8'
            onHide={close}
        >
            <div className='flex flex-column gap-4'>
                <Panel header={t('module:field.group.leader')} toggleable={true}>
                    <StudentInfo data={info?.leader.student} />
                </Panel>

                <Panel header={t('module:field.group.members')} toggleable={true} collapsed={true}>
                    {info?.members?.map((t) => (
                        <div key={Math.random().toString()}>
                            <StudentInfo data={t} />
                            <Divider />
                        </div>
                    ))}
                </Panel>
            </div>

            <div className='flex align-items-center gap-2 absolute bottom-0 left-0 right-0 bg-white p-4'>
                <Button label={t('back')} icon='pi pi-chevron-left' onClick={close} />
            </div>
        </Dialog>
    );
});

GroupForm.displayName = 'Group Form';

export default GroupForm;
export type { GroupFormRefType };
