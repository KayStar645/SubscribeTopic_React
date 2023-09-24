import { AUTH_TOKEN, USER } from '@assets/configs';
import { getUserMenu } from '@assets/configs/user_menu';
import { language } from '@assets/helpers';
import { useDispatch } from '@assets/redux';
import menuSlice from '@assets/redux/slices/menu/slice';
import { LanguageType } from '@assets/types/lang';
import { MenuItemType } from '@assets/types/menu';
import { useTranslation } from '@resources/i18n';
import { deleteCookie, getCookie } from 'cookies-next';
import { usePathname } from 'next/navigation';
import { Avatar } from 'primereact/avatar';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useEffect, useRef, useState } from 'react';
import Breadcrumb from '../UI/Breadcrumb';
import { MenuItem } from '../UI/MenuItem';

const Header = ({ lng }: LanguageType) => {
	const { t } = useTranslation(lng);
	const [user, setUser] = useState({ name: '' });
	const userModalRef = useRef<OverlayPanel>(null);
	const pathName = usePathname();
	const menu = getUserMenu(t, lng, language.getRealPathName(pathName));
	const dispatch = useDispatch();

	useEffect(() => {
		setUser(getCookie('user') ? JSON.parse(getCookie('user')!) : '');
	}, []);

	const renderItem = (item: MenuItemType) => {
		const onLogoutClick = () => {
			deleteCookie(AUTH_TOKEN);
			deleteCookie(USER);
			dispatch(menuSlice.actions.onItemClick({ activeItem: 'home', openMenu: false, parent: '' }));
		};

		return (
			<MenuItem
				key={item.code}
				{...item}
				onItemClick={() => {
					let event = () => {};

					if (item.code === 'logout') {
						event = onLogoutClick;
					}

					event();
				}}
			/>
		);
	};

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
					className='px-2 py-1'
				>
					{menu.map(renderItem)}
				</OverlayPanel>
			</div>
		</div>
	);
};

export default Header;
