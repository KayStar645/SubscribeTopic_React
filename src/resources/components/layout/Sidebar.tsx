import menu from '@assets/configs/menu';
import MenuItem from '../UI/MenuItem/MenuItem';
import Image from 'next/image';
import LogoImage from '@resources/image/logo.png';
import useTranslation from 'next-translate/useTranslation';

const Menu = () => {
	const { t } = useTranslation();

	return (
		<div className='flex flex-column gap-2 bg-white w-19rem h-screen relative'>
			<div className='flex px-3 gap-2 align-items-center absolute bg-white shadow-1 h-5rem'>
				<Image
					src={LogoImage}
					alt=''
					width={50}
					height={50}
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
