import { LanguageProps } from '@assets/types/lang';
import { useTranslation } from '@resources/i18n';
import { deleteCookie, getCookie } from 'cookies-next';
import { Avatar } from 'primereact/avatar';
import { useEffect, useRef, useState } from 'react';
import Breadcrumb from '../UI/Breadcrumb';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { language } from '@assets/helpers';
import { ROUTES, AUTH_TOKEN, USER } from '@assets/configs';

const Header = ({ lng }: LanguageProps) => {
	const { t } = useTranslation(lng);
	const [user, setUser] = useState({ name: '' });
	const userModalRef = useRef<OverlayPanel>(null);
	const router = useRouter();

	useEffect(() => {
		setUser(getCookie('user') ? JSON.parse(getCookie('user')!) : '');
	}, []);

	return (
		<div className='flex align-items-center justify-content-between flex-1 h-5rem shadow-1 bg-white px-4'>
			<Breadcrumb lng={lng} />

			<div
				className='flex align-items-center justify-content-end gap-6'
				style={{ marginRight: '-0.5rem' }}
			>
				<div className='flex align-items-center gap-2'>
					<Avatar
						icon='pi pi-bell'
						shape='circle'
						className='bg-primary text-white'
					/>
					<p>{t('notification')}</p>
				</div>
				<div
					className='flex align-items-center gap-2 hover:surface-hover cursor-pointer p-2 border-round-lg'
					onClick={(e) => userModalRef?.current?.toggle(e)}
				>
					<Avatar
						icon='pi pi-user'
						shape='circle'
						className='bg-primary text-white'
					/>
					<p>{user.name}</p>

					<i className='pi pi-angle-down ml-2'></i>
				</div>

				<OverlayPanel
					ref={userModalRef}
					className='p-2'
				>
					<div
						className='hover:surface-hover cursor-pointer border-round-lg p-3 flex align-items-center gap-3'
						onClick={() => {
							deleteCookie(AUTH_TOKEN);
							deleteCookie(USER);
							router.push(language.addPrefixLanguage(lng, ROUTES.auth.sign_in));
						}}
					>
						<i className='pi pi-sign-out text-sm'></i>
						<p className='text-sm font-semibold'>Đăng xuất</p>
					</div>
				</OverlayPanel>
			</div>
		</div>
	);
};

export default Header;
