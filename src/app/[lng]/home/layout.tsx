'use client';

import { FACULTY_TOKEN } from '@assets/configs';
import { PageProps } from '@assets/types/UI';
import { SelectFacultyModalRefType } from '@assets/types/modal';
import { Header, Sidebar } from '@resources/components/layout';
import SelectFacultyModal from '@resources/components/modal/SelectFacultyModal';
import { getCookie, setCookie } from 'cookies-next';
import { useEffect, useRef } from 'react';

const HomeLayout = ({ children, params: { lng } }: PageProps) => {
    const selectFacultyRef = useRef<SelectFacultyModalRefType>(null);

    useEffect(() => {
        // if (!getCookie(FACULTY_TOKEN)) {
        //     selectFacultyRef.current?.show();
        // }
        setCookie(FACULTY_TOKEN, {
            id: 1,
        });
    }, []);

    return (
        <body className='min-h-screen surface-200'>
            <div className='flex'>
                <Sidebar lng={lng} />

                <div className='flex-1'>
                    <Header lng={lng} />

                    <div className='p-3'>{children}</div>
                </div>
            </div>

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
