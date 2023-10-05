import { API, ROUTES } from '@assets/configs';
import { request } from '@assets/helpers';
import { FacultyType } from '@assets/interface';
import { useDispatch } from '@assets/redux';
import menuSlice from '@assets/redux/slices/menu/slice';
import { SelectFacultyModalRefType, SelectFacultyModalType } from '@assets/types/modal';
import { useTranslation } from '@resources/i18n';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { RadioButton } from 'primereact/radiobutton';
import { forwardRef, useImperativeHandle, useState } from 'react';

const SelectFacultyModal = forwardRef<SelectFacultyModalRefType, SelectFacultyModalType>(({ lng, onConfirm }, ref) => {
    const { t } = useTranslation(lng);
    const [selected, setSelected] = useState<FacultyType | undefined>();
    const [visible, setVisible] = useState(false);
    const dispatch = useDispatch();
    const facultyQuery = useQuery<FacultyType[]>({
        queryKey: ['select_faculty'],
        queryFn: async () => {
            const response = await request.get(`${API.admin.faculty}`);

            return response.data.data || [];
        },
    });
    const router = useRouter();

    const show = (selected?: FacultyType) => {
        setSelected(selected || facultyQuery.data?.[0]);
        setVisible(true);
    };

    const hide = () => {
        setVisible(false);
    };

    const Footer = () => (
        <div className='flex align-items-center justify-content-end'>
            <Button
                disabled={!selected}
                label={t('confirm')}
                onClick={() => {
                    dispatch(menuSlice.actions.onItemClick({ activeItem: 'home', openMenu: false, parent: '' }));
                    onConfirm(selected);
                    hide();
                    router.push(`/${lng}/${ROUTES.admin.home}`);
                }}
            />
        </div>
    );

    const renderItem = (item: FacultyType) => (
        <div key={item.id}>
            <div
                className='flex align-items-center justify-content-between hover:text-primary cursor-pointer'
                onClick={() => setSelected(item)}
            >
                <p className='font-semibold'>{item.name}</p>
                <RadioButton checked={item.id === selected?.id} inputId={item.name + '_' + item.id} />
            </div>

            <Divider className='border-100 border-top-1' />
        </div>
    );

    useImperativeHandle(ref, () => ({
        show,
    }));

    return (
        <Dialog
            header={t('select_faculty')}
            footer={Footer}
            position='top'
            visible={visible}
            draggable={false}
            closable={false}
            style={{ width: '45vw' }}
            className='overflow-hidden mt-6'
            onHide={() => {
                hide();
            }}
        >
            <div className='flex flex-column'>{facultyQuery.data && facultyQuery.data.map(renderItem)}</div>
        </Dialog>
    );
});

SelectFacultyModal.displayName = 'Select Faculty Modal';

export default SelectFacultyModal;
