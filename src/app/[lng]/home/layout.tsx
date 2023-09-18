'use client';

import { PageProps } from '@assets/types/common';
import Breadcrumb from '@resources/components/UI/Breadcrumb';
import { Header, Sidebar } from '@resources/components/layout';

const HomeLayout = ({ children, params: { lng } }: PageProps) => {
	return (
		<body className='min-h-screen surface-100'>
			<div className='flex'>
				<Sidebar lng={lng} />

				<div className='flex-1'>
					<Header lng={lng} />

					<div className='px-3'>
						<div className='flex justify-content-end py-3'>
							<Breadcrumb lng={lng} />
						</div>

						{children}
					</div>
				</div>
			</div>
		</body>
	);
};

export default HomeLayout;
