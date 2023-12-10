'use client';

import { PageProps } from '@assets/types/UI';
import { Header, Sidebar } from '@resources/components/layout';
import { ToastContainer } from 'react-toastify';

const Layout = ({ children, params: { lng } }: PageProps) => {
    return (
        <body className='min-h-screen surface-100 overflow-hidden m-0'>
            <div className='flex'>
                <Sidebar lng={lng} />

                <div style={{ width: 'calc(100vw - 19rem)' }}>
                    <Header lng={lng} />

                    <div className='p-3 overflow-auto' style={{ height: 'calc(100vh - 4rem)', marginTop: '4rem' }}>
                        {children}
                    </div>
                </div>
            </div>
            <ToastContainer />
        </body>
    );
};

export default Layout;
