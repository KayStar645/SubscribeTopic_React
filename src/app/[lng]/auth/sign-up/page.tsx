'use client';

import { AUTH_TOKEN, ROUTES, TOKEN_EXPIRE } from '@assets/configs';
import { language, request } from '@assets/helpers';
import { PageProps } from '@assets/types/UI';
import { yupResolver } from '@hookform/resolvers/yup';
import Loader from '@resources/components/UI/Loader';
import { InputText, Password } from '@resources/components/form';
import { useTranslation } from '@resources/i18n';
import { useMutation } from '@tanstack/react-query';
import { setCookie } from 'cookies-next';
import { usePathname, useRouter } from 'next/navigation';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

const Page = ({ params: { lng } }: PageProps) => {
    const router = useRouter();
    const pathName = usePathname();
    const { t } = useTranslation(lng);
    const schema = yup.object({
        account: yup.string().required(t('validation:required', { attribute: t('account').toLowerCase() })),
        password: yup.string().required(t('validation:required', { attribute: t('password').toLowerCase() })),
        confirm_password: yup.string().required(),
    });
    const { control, handleSubmit } = useForm({ resolver: yupResolver(schema) });
    const signInMutation = useMutation({
        mutationFn: (data: any) => {
            return request.post('/Auth/login', {
                account: data.account,
                password: data.password,
            });
        },
    });

    const onSubmit = (data: any) => {
        signInMutation.mutate(data, {
            onSuccess(response) {
                let user = response.data;

                setCookie(AUTH_TOKEN, user, { expires: TOKEN_EXPIRE });

                console.log(response.data);

                if (user.roll === 'admin') {
                    router.push('http://localhost:4444/vi/home');
                } else {
                    router.push(language.addPrefixLanguage(lng, ROUTES.admin.home));
                }
            },
        });
    };

    const onLanguageChange = (e: DropdownChangeEvent) => {
        router.push(language.createNewPath(e.value, pathName));
    };

    return (
        <div className='flex align-items-center justify-content-center h-full w-full'>
            <div
                className='flex flex-wrap shadow-2 border-round-2xl overflow-hidden bg-white p-5'
                style={{ width: '40vw' }}
            >
                <Loader show={signInMutation.isLoading} />

                <div className='flex-1'>
                    <div className='flex align-items-center justify-content-between mb-5'>
                        <div className='flex align-items-center gap-2'>
                            <Avatar label='7' size='large' shape='circle' className='bg-primary' />
                            <p className='font-semibold text-xl'>7NoSQL</p>
                        </div>
                        <span className='text-2xl font-semibold text-900'>{t('sign_in_to_continue')}</span>
                        {/* <a
							tabIndex={0}
							className='font-medium text-blue-500 hover:text-blue-700 cursor-pointer transition-colors transition-duration-150'
						>
							Sign up
						</a> */}
                    </div>
                    <form className='flex flex-column gap-4' onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            name='account'
                            control={control}
                            render={({ field, formState }) => (
                                <InputText
                                    id='account'
                                    value={field.value}
                                    label={t('account')}
                                    placeholder={t('account')}
                                    errorMessage={formState.errors.account?.message}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                />
                            )}
                        />

                        <Controller
                            name='password'
                            control={control}
                            render={({ field, formState }) => (
                                <Password
                                    id='password'
                                    value={field.value}
                                    label={t('password')}
                                    placeholder={t('password')}
                                    errorMessage={formState.errors.password?.message}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                />
                            )}
                        />

                        <Controller
                            name='confirm_password'
                            control={control}
                            render={({ field, fieldState }) => (
                                <Password
                                    id='confirm_password'
                                    value={field.value}
                                    label={t('confirm_password')}
                                    placeholder={'Xác nhận mật khẩu'}
                                    errorMessage={fieldState.error?.message}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                />
                            )}
                        />
                        <div className='flex align-items-center justify-content-between'>
                            <div>
                                {signInMutation.isError && (
                                    <small className='p-error'>{t('validation:custom.login_fail')}</small>
                                )}
                                {/* <Controller
								name='remember_password'
								control={control}
								render={({ field }) => (
									<Checkbox
										id='remember_password'
										value={field.value}
										label={t('remember_password')}
										onChange={(e) => field.onChange(e.checked)}
									/>
								)}
							/> */}
                            </div>
                            <a className='font-medium text-blue-500 hover:text-blue-700 cursor-pointer transition-colors transition-duration-150'>
                                Tạo tài khoản
                            </a>
                        </div>

                        <Button label={t('sign_in')} className='w-full font-medium py-3 ' rounded={true} />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Page;
