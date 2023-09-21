'use client';

import { PageProps } from '@assets/types/UI';
import { Header, Sidebar } from '@resources/components/layout';

const HomeLayout = ({ children, params: { lng } }: PageProps) => {
	return (
		<body className='min-h-screen surface-200'>
			<div className='flex'>
				<Sidebar lng={lng} />

				<div className='flex-1'>
					<Header lng={lng} />

					<div className='p-3'>{children}</div>
				</div>
			</div>
		</body>
	);
};

export default HomeLayout;
