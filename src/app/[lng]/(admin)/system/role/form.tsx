import { API } from '@assets/configs';
import { request } from '@assets/helpers';
import { RoleType } from '@assets/interface';
import { LanguageType } from '@assets/types/lang';
import { ResponseType } from '@assets/types/request';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader } from '@resources/components/UI';
import { Checkbox, InputText } from '@resources/components/form';
import { useTranslation } from '@resources/i18n';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { TFunction } from 'i18next';
import { snakeCase } from 'lodash';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { Panel, PanelHeaderTemplateOptions } from 'primereact/panel';
import { Sidebar } from 'primereact/sidebar';
import { classNames } from 'primereact/utils';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

interface RoleFormRefType {
    show?: (_data?: RoleType) => void;
    close?: () => void;
}

interface RoleFormType extends LanguageType {
    title: string;
    onSuccess?: (_data: RoleType) => void;
}

interface PermissionType {
    name: string;
    actions: string[];
}

const defaultValues: RoleType = {
    id: '0',
    name: '',
    permissionsName: [],
};

const schema = (t: TFunction) =>
    yup.object({
        name: yup.string().required(
            t('validation:required', {
                attribute: t('common:name_of', { obj: t('module:role') }).toLowerCase(),
            }),
        ),
        permissionsName: yup.array(yup.string()).required(),
    });

const RoleForm = forwardRef<RoleFormRefType, RoleFormType>(({ title, lng, onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const { t } = useTranslation(lng);
    const [groupPermissions, setGroupPermissions] = useState<PermissionType[]>([]);
    const [permissions, setPermissions] = useState<string[]>([]);

    const { control, handleSubmit, reset, setValue, getValues } = useForm({
        resolver: yupResolver(schema(t)) as Resolver<RoleType>,
        defaultValues,
    });

    const permissionQuery = useQuery<string[], AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        enabled: false,
        queryKey: ['groupPermissions', 'list'],
        queryFn: async () => {
            const response = await request.get<string[]>(API.admin.permission);

            return response.data.data || [];
        },
        onSuccess(data) {
            setGroupPermissions(
                data.reduce<PermissionType[]>((acc, permission) => {
                    const [name] = permission.split('.');
                    const existingObject = acc.find((obj) => obj.name === snakeCase(name));

                    if (existingObject) {
                        existingObject.actions.push(permission);
                    } else {
                        acc.push({ name: snakeCase(name), actions: [permission] });
                    }

                    return acc;
                }, []),
            );
        },
    });

    const permissionDetailQuery = useQuery<RoleType, AxiosError<ResponseType>>({
        queryKey: ['permissionsDetail'],
        refetchOnWindowFocus: false,
        enabled: false,
        queryFn: async () => {
            const response = await request.get<RoleType>(`${API.admin.detail.role}?pId=${getValues('id')}`);

            return response.data.data || {};
        },
        onSuccess(data) {
            setPermissions(data.permissionsName || []);
            setValue('permissionsName', data.permissionsName || []);
        },
        onError() {
            setPermissions([]);
        },
    });

    const roleMutation = useMutation<any, AxiosError<ResponseType>, RoleType>({
        mutationFn: (data) => {
            return data.id == '0' ? request.post(API.admin.role, data) : request.update(API.admin.role, data);
        },
    });

    const show = (data?: RoleType) => {
        setVisible(true);

        if (data) {
            reset(data);
        } else {
            reset(defaultValues);
        }

        if (getValues('id') != '0') {
            permissionDetailQuery.refetch();
        }

        permissionQuery.refetch();
    };

    const close = () => {
        setVisible(false);
        reset(defaultValues);
        setPermissions([]);
        setGroupPermissions([]);
    };

    const onSubmit = (data: RoleType) => {
        roleMutation.mutate(data, {
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

    const onCheckPermission = (checked: boolean, permission: PermissionType) => {
        if (checked) {
            setPermissions((prev) => [...prev, ...permission.actions]);
            setValue('permissionsName', [...permissions, ...permission.actions]);
        } else {
            const permissionsFilter = permissions.filter((t) => !permission.actions.includes(t));

            setPermissions(permissionsFilter);
            setValue('permissionsName', permissionsFilter);
        }
    };

    const Header = ({ options, permission }: { options: PanelHeaderTemplateOptions; permission: PermissionType }) => {
        const toggleIcon = options.collapsed ? 'pi pi-chevron-down' : 'pi pi-chevron-up';

        return (
            <div className={classNames(options.className, 'flex align-items-center gap-3 h-3rem pr-2')}>
                <Checkbox
                    id={permission.name}
                    label={t(`module:${permission.name}`)}
                    value={permission?.actions?.every((action) => permissions.includes(action))}
                    onChange={(e) => onCheckPermission(!!e.checked, permission)}
                    blockClassName='flex-1'
                />

                <div className='flex align-items-center gap-2'>
                    {permission.actions.map(
                        (action) =>
                            permissions.includes(action) && (
                                <Chip key={action} label={t(`common:${action?.split('.')[1].toLowerCase()}`)} />
                            ),
                    )}
                </div>

                <Button
                    icon={toggleIcon}
                    onClick={(e) => {
                        options.onTogglerClick(e);
                    }}
                    rounded={true}
                    text={true}
                    severity='secondary'
                    className='w-2rem h-2rem'
                />
            </div>
        );
    };

    const Permission = ({ permission }: { permission: PermissionType }) => {
        return (
            <div className='col-6'>
                <Checkbox
                    id={`permission_${permission.name}_${permission.actions[0]}`}
                    label={t(`common:${permission.actions[0]?.split('.')[1].toLowerCase()}`)}
                    value={!!permissions.includes(permission.actions[0])}
                    onChange={(e) => onCheckPermission(!!e.checked, permission)}
                />
            </div>
        );
    };

    useImperativeHandle(ref, () => ({
        show,
        close,
    }));

    return (
        <Sidebar
            header={<h3 className='p-0 font-bold text-900 m-0 text-xl'>{title}</h3>}
            visible={visible}
            className='overflow-hidden pb-7'
            style={{ width: '50vw' }}
            onHide={close}
            position='right'
        >
            <Loader show={roleMutation.isPending || permissionQuery.isFetching || permissionDetailQuery.isFetching} />

            <form className='mt-2 flex flex-column gap-3' onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name='name'
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputText
                            id='form_data_name'
                            value={field.value}
                            required={true}
                            label={t('common:name_of', { obj: t('module:role').toLowerCase() })}
                            placeholder={t('common:name_of', { obj: t('module:role').toLowerCase() })}
                            errorMessage={fieldState.error?.message}
                            onChange={field.onChange}
                        />
                    )}
                />

                {groupPermissions.map((permission) => {
                    return (
                        <Panel
                            key={permission.name}
                            headerTemplate={(options) => <Header options={options} permission={permission} />}
                            toggleable={true}
                            collapsed={true}
                        >
                            <div className='flex flex-wrap align-items-center'>
                                {permission.actions.map((action) => (
                                    <Permission
                                        key={action}
                                        permission={{ name: permission.name, actions: [action] }}
                                    />
                                ))}
                            </div>
                        </Panel>
                    );
                })}

                <div className='flex align-items-center justify-content-end gap-2 absolute bottom-0 left-0 right-0 bg-white p-4 h-4rem shadow-8'>
                    <Button
                        size='small'
                        label={t('cancel')}
                        icon='pi pi-undo'
                        severity='secondary'
                        onClick={(e) => {
                            e.preventDefault();
                            close();
                        }}
                    />
                    <Button size='small' label={t('save')} icon='pi pi-save' />
                </div>
            </form>
        </Sidebar>
    );
});

RoleForm.displayName = 'Role Form';

export default RoleForm;
export type { RoleFormRefType };
