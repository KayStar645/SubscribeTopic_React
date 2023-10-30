import { GroupType } from '@assets/interface';
import { LanguageType } from '@assets/types/lang';
import { InputText } from '@resources/components/form';
import { useTranslation } from '@resources/i18n';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface GroupFormRefType {
    show?: (data?: GroupType) => void;
    close?: () => void;
}

interface GroupFormType extends LanguageType {
    title: string;
}

const defaultValues: GroupType = {
    id: '0',
    countMember: 0,
    leaderId: 0,
    leader: undefined,
    members: [],
};

const GroupForm = forwardRef<GroupFormRefType, GroupFormType>(({ title, lng }, ref) => {
    const [visible, setVisible] = useState(false);
    const { t } = useTranslation(lng);

    const { control, reset } = useForm({
        defaultValues,
    });

    const show = (data?: GroupType) => {
        setVisible(true);

        if (data) {
            reset(data);
        } else {
            reset(defaultValues);
        }
    };

    const close = () => {
        setVisible(false);
        reset(defaultValues);
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
            className='overflow-hidden'
            contentClassName='mb-8'
            onHide={close}
        >
            <div className='mt-2 flex flex-column gap-3'>
                <Controller
                    name='internalCode'
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputText
                            id='form_data_internal_code'
                            value={field.value}
                            label={t('code_of', { obj: t('module:industry').toLowerCase() })}
                            placeholder={t('code_of', { obj: t('module:industry').toLowerCase() })}
                            errorMessage={fieldState.error?.message}
                            onChange={(e) => field.onChange(e.target.value)}
                        />
                    )}
                />

                <Controller
                    name='name'
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputText
                            id='form_data_name'
                            value={field.value}
                            label={t('name_of', { obj: t('module:industry').toLowerCase() })}
                            placeholder={t('name_of', { obj: t('module:industry').toLowerCase() })}
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
                        />
                    )}
                />

                <div className='flex align-items-center gap-2 absolute bottom-0 left-0 right-0 bg-white p-4'>
                    <Button label={t('back')} icon='pi pi-chevron-left' onClick={close} />
                </div>
            </div>
        </Dialog>
    );
});

GroupForm.displayName = 'Group Form';

export default GroupForm;
export type { GroupFormRefType };
