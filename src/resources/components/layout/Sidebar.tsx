import menu from '@assets/configs/menu';
import { useDispatch } from '@assets/redux';
import languageSlice from '@assets/redux/slices/language/slice';
import { useTranslation } from '@resources/i18n';
import LogoImage from '@resources/image/logo.png';
import { getCookie } from 'cookies-next';
import Image from 'next/image';
import { useEffect } from 'react';
import { MenuItem } from '../UI/MenuItem';

const Menu = ({ lng }: { lng: string }) => {
	const dispatch = useDispatch();
	const { t } = useTranslation(getCookie('i18next') || lng);

	useEffect(() => {
		dispatch(languageSlice.actions.setLanguage({ currLanguage: lng }));
	}, [dispatch, lng]);

	return (
		<div className='flex flex-column gap-2 bg-white w-19rem h-screen relative'>
			<div className='w-full flex px-3 gap-2 align-items-center absolute bg-white shadow-1 h-5rem'>
				<Image
					src={LogoImage}
					alt=''
					width={50}
					height={50}
					priority={false}
				/>
				<p className='flex-1'>{t('info:product_name')}</p>
			</div>

			<ul className='flex flex-column gap-1 p-2 mt-8 overflow-y-auto h-full'>
				{menu.map((item) => (
					<MenuItem
						key={Math.random().toString()}
						code={item.code}
						label={item.label}
						icon={item.icon}
						to={item.to}
						items={item.items}
					/>
				))}
			</ul>
		</div>
	);
};

export default Menu;
