'use client';

import { FACULTY_TOKEN } from '@assets/configs';
import { PageProps } from '@assets/types/UI';
import { Header, Sidebar } from '@resources/components/layout';
import { setCookie } from 'cookies-next';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HomeLayout = ({ children, params: { lng } }: PageProps) => {
    // const selectFacultyRef = useRef<SelectFacultyModalRefType>(null);

    useEffect(() => {
        // if (!getCookie(FACULTY_TOKEN)) {
        //     selectFacultyRef.current?.show();
        // }
        setCookie(FACULTY_TOKEN, {
            id: 3,
        });
    }, []);

    return (
        <body className='min-h-screen surface-200 overflow-hidden'>
            <div className='flex'>
                <Sidebar lng={lng} />

                <div className='flex-1'>
                    <Header lng={lng} />

                    <div className='p-3 overflow-auto' style={{ height: 'calc(100vh - 5rem)' }}>
                        {children}
                    </div>
                </div>
            </div>

            <ToastContainer />

            {/* <SelectFacultyModal
                ref={selectFacultyRef}
                lng={lng}
                onConfirm={(item) => {
                    setCookie(FACULTY_TOKEN, item);
                }}
            /> */}
        </body>
    );
};

export default HomeLayout;
