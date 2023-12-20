import { API } from '@assets/configs';
import { request } from '@assets/helpers';
import { AccountType, RoleType } from '@assets/interface';
import { LanguageType } from '@assets/types/lang';
import { ResponseType } from '@assets/types/request';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader } from '@resources/components/UI';
import { InputText, Password } from '@resources/components/form';
import { useTranslation } from '@resources/i18n';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { TFunction } from 'i18next';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

interface PasswordFormRefType {
    show?: (_data?: AccountType) => void;
    close?: () => void;
}

interface PasswordFormType extends LanguageType {
    title: string;
    onSuccess?: (_data: AccountType) => void;
}

const defaultValues = {
    userName: '',
    password: '',
    confirm: '',
};

const schema = (t: TFunction) =>
    yup.object({
        userName: yup.string().required(),
        password: yup.string().required(),
        confirm: yup
            .string()
            .required()
            .oneOf([yup.ref('password')], 'Passwords must match'),
    });

const AccountForm = forwardRef<PasswordFormRefType, PasswordFormType>(({ title, lng, onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const { t } = useTranslation(lng);

    const { control, handleSubmit, reset } = useForm({
        resolver: yupResolver(schema(t)),
        defaultValues,
    });

    const accountMutation = useMutation<any, AxiosError<ResponseType>, AccountType>({
        mutationFn: (data) => {
            return request.post(API.auth.register, data);
        },
    });

    const roleQuery = useQuery<RoleType[], AxiosError<ResponseType>>({
        enabled: false,
        queryKey: ['roles', 'list'],
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const response = await request.get<RoleType[]>(`${API.admin.role}`);

            return response.data.data || [];
        },
    });

    const show = (data?: AccountType) => {
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

    const onSubmit = (data: AccountType) => {
        accountMutation.mutate(data, {
            onSuccess: (response) => {
                close();
                onSuccess?.(response.data);
                toast.success(t('request:update_success'));
            },
        });
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
            <Loader show={accountMutation.isPending} />

            <form className='mt-2 flex flex-column gap-3' onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name='userName'
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputText
                            id='form_data_account'
                            value={field.value}
                            label={t('module:account')}
                            placeholder={t('module:account')}
                            errorMessage={fieldState.error?.message}
                            required={true}
                            onChange={field.onChange}
                        />
                    )}
                />

                <Controller
                    name='password'
                    control={control}
                    render={({ field, fieldState }) => (
                        <Password
                            id='form_data_password'
                            value={field.value}
                            required={true}
                            label={t('common:password')}
                            placeholder={t('common:password')}
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
                        />
                    )}
                />

                <Controller
                    name='confirm'
                    control={control}
                    render={({ field, fieldState }) => (
                        <Password
                            id='form_data_confirm'
                            value={field.value}
                            required={true}
                            label={t('common:confirm_password')}
                            placeholder={t('common:confirm_password')}
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
                        />
                    )}
                />

                <div className='flex align-items-center justify-content-end gap-2 absolute bottom-0 left-0 right-0 bg-white p-4'>
                    <Button
                        label={t('cancel')}
                        icon='pi pi-undo'
                        severity='secondary'
                        onClick={(e) => {
                            e.preventDefault();
                            close();
                        }}
                    />
                    <Button label={t('save')} icon='pi pi-save' />
                </div>
            </form>
        </Dialog>
    );
});

AccountForm.displayName = 'Account Form';

export default AccountForm;
export type { PasswordFormRefType };
