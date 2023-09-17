import Sidebar from '@resources/components/layout/Sidebar';
import { PropsWithChildren } from 'react';
import '../../resources/styles/layout/layout.scss';
import Header from '@resources/components/layout/Header';

const HomeLayout = ({ children }: PropsWithChildren) => {
	return (
		<div>
			<div className='flex'>
				<Sidebar />

				<div className='flex-1'>
					<Header />
					{children}
				</div>
			</div>
		</div>
	);
};

export default HomeLayout;
