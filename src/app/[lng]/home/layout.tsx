'use client';

import { FACULTY_TOKEN } from '@assets/configs';
import { PageProps } from '@assets/types/UI';
import { SelectFacultyModalRefType } from '@assets/types/modal';
import { Header, Sidebar } from '@resources/components/layout';
import SelectFacultyModal from '@resources/components/modal/SelectFacultyModal';
import { getCookie, setCookie } from 'cookies-next';
import { useEffect, useRef } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HomeLayout = ({ children, params: { lng } }: PageProps) => {
    const selectFacultyRef = useRef<SelectFacultyModalRefType>(null);

    useEffect(() => {
        if (!getCookie(FACULTY_TOKEN)) {
            selectFacultyRef.current?.show();
        }
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

            <SelectFacultyModal
                ref={selectFacultyRef}
                lng={lng}
                onConfirm={(item) => {
                    setCookie(FACULTY_TOKEN, item);
                }}
            />
        </body>
    );
};

export default HomeLayout;
