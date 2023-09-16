import Menu from '@resources/components/layout/Sidebar';
import { PropsWithChildren } from 'react';
import '../../resources/styles/layout/layout.scss';

const HomeLayout = ({ children }: PropsWithChildren) => {
	return (
		<div>
			<div className='flex gap-4 p-4'>
				<Menu />

				{children}
			</div>
		</div>
	);
};

export default HomeLayout;
