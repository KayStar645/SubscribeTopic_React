import { API } from '@assets/configs';
import { request } from '@assets/helpers';
import { AccountType, RoleType } from '@assets/interface';
import { LanguageType } from '@assets/types/lang';
import { ResponseType } from '@assets/types/request';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader } from '@resources/components/UI';
import { InputText } from '@resources/components/form';
import { useTranslation } from '@resources/i18n';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { TFunction } from 'i18next';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { PickList, PickListChangeEvent } from 'primereact/picklist';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

interface MutateData {
    userId: number;
    roleId: number;
}

interface AssignFormRefType {
    show?: (_data?: AccountType) => void;
    close?: () => void;
}

interface AssignFormType extends LanguageType {
    title: string;
    onSuccess?: (_data: AccountType) => void;
}

const defaultValues: AccountType = {
    userName: '',
    roles: [],
};

const schema = (t: TFunction) =>
    yup.object({
        userName: yup.string().required(),
        roles: yup.array(yup.string()),
    });

const AssignForm = forwardRef<AssignFormRefType, AssignFormType>(({ title, lng, onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const { t } = useTranslation(lng);
    let role: string[] = [];

    const { control, handleSubmit, reset, setValue } = useForm({
        resolver: yupResolver(schema(t)) as Resolver<AccountType>,
        defaultValues,
    });

    const assignMutation = useMutation<any, AxiosError<ResponseType>, MutateData>({
        mutationFn: (data) => {
            return request.post(API.admin.assign.role, data);
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

    role = roleQuery.data?.map((t) => t.name!) || [];

    const show = (data?: AccountType) => {
        setVisible(true);

        if (data) {
            reset(data);
        } else {
            reset(defaultValues);
        }

        roleQuery.refetch();
    };

    const close = () => {
        setVisible(false);
        reset(defaultValues);
    };

    const onSubmit = (data: RoleType) => {
        assignMutation.mutate(data, {
            onSuccess: (response) => {
                close();
                onSuccess?.(response.data);
                toast.success(t('request:update_success'));
            },
            onError: (err) => {
                toast.error(err.response?.data.messages?.[0] || err.message);
            },
        });
    };

    const onChange = (event: PickListChangeEvent) => {
        role = event.source;
        setValue('roles', event.target);
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
            <Loader show={assignMutation.isPending || roleQuery.isLoading} />

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
                            disabled={true}
                            onChange={field.onChange}
                        />
                    )}
                />

                <Controller
                    name='roles'
                    control={control}
                    render={({ field }) => (
                        <PickList
                            source={role?.filter((t) => !field.value?.includes(t))}
                            target={field.value}
                            onChange={onChange}
                            itemTemplate={(role: string) => <p className='text-900'>{role}</p>}
                            filter={true}
                            filterBy='name'
                            sourceHeader={t('common:list_of', { module: t('module:role').toLowerCase() })}
                            targetHeader={t('common:now_available')}
                            sourceStyle={{ height: '20rem' }}
                            targetStyle={{ height: '20rem' }}
                            sourceFilterPlaceholder={t('common:search')}
                            targetFilterPlaceholder={t('common:search')}
                            showSourceControls={false}
                            showTargetControls={false}
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

AssignForm.displayName = 'Account Form';

export default AssignForm;
export type { AssignFormRefType };
