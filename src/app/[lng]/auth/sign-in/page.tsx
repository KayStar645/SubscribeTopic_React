'use client';

import { API, AUTH_TOKEN, ROUTES, TOKEN_EXPIRE, USER } from '@assets/configs';
import { language, request } from '@assets/helpers';
import { PageProps } from '@assets/types/UI';
import { yupResolver } from '@hookform/resolvers/yup';
import Loader from '@resources/components/UI/Loader';
import { InputText, Password } from '@resources/components/form';
import { useTranslation } from '@resources/i18n';
import brand from '@resources/image/info/brand.png';
import { useMutation } from '@tanstack/react-query';
import { setCookie } from 'cookies-next';
import { usePathname, useRouter } from 'next/navigation';
import { PrimeIcons } from 'primereact/api';
import { Button } from 'primereact/button';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { Image } from 'primereact/image';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

const Page = ({ params: { lng } }: PageProps) => {
    const router = useRouter();
    const pathName = usePathname();
    const { t } = useTranslation(lng);
    const schema = yup.object({
        userName: yup.string().required(t('validation:required', { attribute: t('account').toLowerCase() })),
        password: yup.string().required(t('validation:required', { attribute: t('password').toLowerCase() })),
        remember_password: yup.boolean(),
    });
    const { control, handleSubmit } = useForm({ resolver: yupResolver(schema) });
    const signInMutation = useMutation({
        mutationFn: (data: any) => {
            return request.post(API.auth.sign_in, {
                userName: data.userName,
                password: data.password,
            });
        },
    });

    const onSubmit = (data: any) => {
        signInMutation.mutate(data, {
            onSuccess(response) {
                setCookie(AUTH_TOKEN, response.data.data.token, { expires: TOKEN_EXPIRE });
                setCookie(
                    USER,
                    { id: response.data.data.id, name: response.data.data.userName },
                    { expires: TOKEN_EXPIRE },
                );

                router.push(language.addPrefixLanguage(lng, ROUTES.admin.home));
            },
        });
    };

    const onLanguageChange = (e: DropdownChangeEvent) => {
        router.push(language.createNewPath(e.value, pathName));
    };

    return (
        <div className='flex align-items-center justify-content-center h-full w-full'>
            {/* <div className='absolute right-0 top-0 p-4 sm:p-4 md:p-6 lg:px-8'>
				<Dropdown
					id='language'
					value={lng}
					placeholder={t('language')}
					options={LANGUAGES}
					onChange={onLanguageChange}
				/>
			</div> */}

            <div className='flex flex-wrap shadow-2 w-full border-round-2xl overflow-hidden'>
                <Loader show={signInMutation.isLoading} />

                <div className='w-full lg:w-6 p-4 lg:p-7 bg-blue-50'>
                    <div className='pb-3'>
                        <Image src={brand.src} alt='Image' height='80' />
                    </div>
                    <div className='text-xl text-black-alpha-90 font-500 mb-3'>{t('welcome_to_system')}</div>
                    <p className='text-black-alpha-50 line-height-3 mt-0 mb-6'>
                        Thêm lời chào khi vào hệ thống vào đây
                    </p>
                    <ul className='list-none p-0 m-0'>
                        <li className='flex align-items-start mb-4'>
                            <div>
                                <Button icon={PrimeIcons.INBOX} severity='help' />
                            </div>
                            <div className='ml-3'>
                                <span className='font-medium text-black-alpha-90'>Unlimited Inbox</span>
                                <p className='mt-2 mb-0 text-black-alpha-50 line-height-3'>
                                    Thêm mô tả ngắn về hệ thống tại đây
                                </p>
                            </div>
                        </li>
                        <li className='flex align-items-start mb-4'>
                            <div>
                                <Button icon={PrimeIcons.SHIELD} severity='help' />
                            </div>
                            <div className='ml-3'>
                                <span className='font-medium text-black-alpha-90'>Premium Security</span>
                                <p className='mt-2 mb-0 text-black-alpha-50 line-height-3'>
                                    Thêm mô tả ngắn về hệ thống tại đây
                                </p>
                            </div>
                        </li>
                        <li className='flex align-items-start'>
                            <div>
                                <Button icon={PrimeIcons.GLOBE} severity='help' />
                            </div>
                            <div className='ml-3'>
                                <span className='font-medium text-black-alpha-90'>Cloud Backups Inbox</span>
                                <p className='mt-2 mb-0 text-black-alpha-50 line-height-3'>
                                    Thêm mô tả ngắn về hệ thống tại đây
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className='w-full lg:w-6 p-4 lg:p-7 surface-card'>
                    <div className='flex align-items-center justify-content-center mb-7'>
                        <span className='text-2xl font-medium text-900'>{t('sign_in_to_continue')}</span>
                        {/* <a
							tabIndex={0}
							className='font-medium text-blue-500 hover:text-blue-700 cursor-pointer transition-colors transition-duration-150'
						>
							Sign up
						</a> */}
                    </div>
                    <form className='flex flex-column gap-4' onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            name='userName'
                            control={control}
                            render={({ field, formState }) => (
                                <InputText
                                    id='account'
                                    value={field.value}
                                    label={t('account')}
                                    placeholder={t('account')}
                                    errorMessage={formState.errors.userName?.message}
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
                        <div className='flex align-items-center justify-content-between'>
                            <div>
                                {signInMutation.isError && (
                                    <small className='text-error'>{t('validation:custom.login_fail')}</small>
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
                                {t('forgot_password')}
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
