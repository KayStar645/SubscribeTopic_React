import { LanguageProps } from '@assets/types/lang';
import { useTranslation } from '@resources/i18n';
import { getCookie } from 'cookies-next';
import { Avatar } from 'primereact/avatar';

const Header = ({ lng }: LanguageProps) => {
	const { t } = useTranslation(lng);
	const user = JSON.parse(getCookie('user') || '');

	return (
		<div className='flex align-items-center justify-content-between flex-1 h-5rem shadow-1 bg-white px-4'>
			<div className='border-circle hover:text-white hover:bg-blue-400  flex align-items-center justify-content-center cursor-pointer transition-ease-in-out transition-duration-300'>
				<Avatar
					icon='pi pi-bars'
					shape='circle'
					className='bg-transparent'
				/>
			</div>

			<div className='flex align-items-center justify-content-end gap-5'>
				<div className='flex align-items-center gap-2'>
					<Avatar
						icon='pi pi-bell'
						shape='circle'
						className='bg-blue-400 text-white'
					/>
					<p>{t('notification')}</p>
				</div>
				<div className='flex align-items-center gap-2'>
					<Avatar
						icon='pi pi-user'
						shape='circle'
						className='bg-blue-400 text-white'
					/>
					<p>{user.name}</p>
				</div>
			</div>
		</div>
	);
};

export default Header;
