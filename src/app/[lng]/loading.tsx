'use client';

import { Loader } from '@resources/components/UI';

const AppLoadingPage = () => {
    return (
        <div className='absolute top-0 left-0 right-0 bottom-0 bg-white'>
            <Loader show={true} />
        </div>
    );
};

export default AppLoadingPage;
