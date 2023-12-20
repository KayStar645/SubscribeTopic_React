import { API } from '@assets/configs';
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
import { Loader } from '../UI';

const SelectFacultyModal = forwardRef<SelectFacultyModalRefType, SelectFacultyModalType>(({ lng, onConfirm }, ref) => {
    const { t } = useTranslation(lng);
    const [selected, setSelected] = useState<FacultyType | undefined>();
    const [visible, setVisible] = useState(false);
    const dispatch = useDispatch();
    const facultyQuery = useQuery<FacultyType[]>({
        refetchOnWindowFocus: false,
        enabled: visible,
        queryKey: ['select_faculty'],
        queryFn: async () => {
            const response = await request.get(`${API.admin.faculty}`);

            return response.data.data || [];
        },
    });
    const router = useRouter();

    const show = (selected?: number) => {
        setSelected({ id: selected } || facultyQuery.data?.[0]);
        setVisible(true);
        facultyQuery.refetch();
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
                    router.refresh();
                }}
            />
        </div>
    );

    const renderItem = (item: FacultyType) => (
        <div key={item.id}>
            <div
                className='flex align-items-center hover:text-primary cursor-pointer gap-3'
                onClick={() => setSelected(item)}
            >
                <RadioButton checked={item.id === selected?.id} inputId={item.name + '_' + item.id} />

                <p className='font-semibold'>{item.name}</p>
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
            visible={visible}
            draggable={false}
            closable={false}
            className='overflow-hidden mt-6 w-30rem relative'
            onHide={() => {
                hide();
            }}
        >
            <Loader show={facultyQuery.isFetching} />

            <div className='flex flex-column'>{facultyQuery.data && facultyQuery.data.map(renderItem)}</div>
        </Dialog>
    );
});

SelectFacultyModal.displayName = 'Select Faculty Modal';

export default SelectFacultyModal;
