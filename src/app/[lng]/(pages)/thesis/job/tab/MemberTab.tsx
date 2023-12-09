import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { useContext } from 'react';
import { JobPageContext } from '../group/[id]/page';

const MemberTab = () => {
    const { t } = useContext(JobPageContext);

    return (
        <div className='flex flex-column gap-5 bg-white border-round shadow-1 p-3'>
            <div>
                <div className='border-bottom-2 border-blue-500 px-3'>
                    <p className='font-semibold text-blue-500 text-2xl py-3'>{t('module:field.thesis.instruction')}</p>
                </div>

                <div className='flex align-items-center gap-3 px-3 pt-4'>
                    <Avatar icon='pi pi-user' className='bg-primary text-white border-circle' size='normal' />
                    <p>Ngô Văn Sơn</p>
                </div>
            </div>

            <div>
                <div className='border-bottom-2 border-blue-500 px-3 flex align-items-center justify-content-between'>
                    <p className='font-semibold text-blue-500 text-2xl py-3'>{t('module:field.job.member')}</p>
                    <p className='text-blue-500 font-semibold'>3 thành viên</p>
                </div>

                <div className='flex flex-column pt-4'>
                    <div className='flex align-items-center gap-3 pl-3'>
                        <Avatar icon='pi pi-user' className='bg-primary text-white border-circle' size='normal' />
                        <p>Ngô Văn Sơn</p>
                    </div>

                    <Divider />
                    <div className='flex align-items-center gap-3 pl-3'>
                        <Avatar icon='pi pi-user' className='bg-primary text-white border-circle' size='normal' />
                        <p>Ngô Văn Sơn</p>
                    </div>

                    <Divider />
                    <div className='flex align-items-center gap-3 pl-3'>
                        <Avatar icon='pi pi-user' className='bg-primary text-white border-circle' size='normal' />
                        <p>Ngô Văn Sơn</p>
                    </div>

                    <Divider />
                </div>
            </div>
        </div>
    );
};

export default MemberTab;
