'use client';

import { AUTH_TOKEN } from '@assets/configs';
import useCookies from '@assets/hooks/useCookies';
import { AuthType } from '@assets/interface';
import { PageProps } from '@assets/types/UI';
import { SelectFacultyModalRefType } from '@assets/types/modal';
import { Header, Sidebar } from '@resources/components/layout';
import { SelectFacultyModal } from '@resources/components/modal';
import { useEffect, useRef } from 'react';
import { ToastContainer } from 'react-toastify';

const Layout = ({ children, params: { lng } }: PageProps) => {
    const selectFacultyRef = useRef<SelectFacultyModalRefType>(null);
    const [auth, setAuth] = useCookies<AuthType>(AUTH_TOKEN);

    useEffect(() => {
        if (auth && auth.type === 'admin' && !auth?.facultyId) {
            selectFacultyRef.current?.show(auth?.facultyId);
        }
    }, [auth]);

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

            <SelectFacultyModal
                ref={selectFacultyRef}
                lng={lng}
                onConfirm={(item) => {
                    if (auth) {
                        setAuth({
                            ...auth,
                            facultyId: parseInt(item?.id?.toString()!),
                        });
                    }
                }}
            />
        </body>
    );
};

export default Layout;
