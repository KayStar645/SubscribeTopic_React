import { useTranslation } from '@resources/i18n';
import LogoImage from '@resources/image/info/logo.png';
import Image from 'next/image';
import { MenuItem } from '../UI/MenuItem';
import { LanguageProps } from '@assets/types/lang';
import { getMenu } from '@assets/configs';

const Menu = ({ lng }: LanguageProps) => {
	const { t } = useTranslation(lng);
	const menu = getMenu(t, lng);

	return (
		<div className='flex flex-column gap-2 bg-white w-19rem h-screen relative shadow-2'>
			<div className='w-full flex flex-column gap-2 align-items-center justify-content-center absolute bg-white z-1 shadow-1 h-11rem'>
				<Image
					src={LogoImage}
					alt=''
					width={100}
					height={100}
					priority={false}
				/>
				<p className='font-semibold text-blue-900 text-2xl'>{t('info:product_name')}</p>
			</div>

			<ul
				className='flex flex-column gap-1 p-2 overflow-y-auto h-full'
				style={{ marginTop: 180 }}
			>
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
