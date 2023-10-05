import { OptionType } from '@assets/types/common';
import { SelectObjectModalRefType, SelectObjectModalType } from '@assets/types/modal';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { RadioButton } from 'primereact/radiobutton';
import { forwardRef, useImperativeHandle, useState } from 'react';

const SelectObjectModal = forwardRef<SelectObjectModalRefType, SelectObjectModalType>(({ title, onConfirm }, ref) => {
    const [items, setItems] = useState<OptionType[]>([]);
    const [selected, setSelected] = useState<OptionType>(items[0]);
    const [visible, setVisible] = useState(false);

    const show = (items: OptionType[], defaultIndex: number = 0) => {
        setItems(items);
        setSelected(items[defaultIndex]);
        setVisible(true);
    };

    const hide = () => {
        setVisible(false);
    };

    const Footer = () => (
        <div className='flex align-items-center justify-content-end'>
            <Button
                label='Xác nhận'
                onClick={() => {
                    onConfirm(selected);
                    hide();
                }}
            />
        </div>
    );

    const renderItem = (item: OptionType) => (
        <div key={item.value}>
            <div
                className='flex align-items-center justify-content-between hover:text-primary cursor-pointer'
                onClick={() => setSelected(item)}
            >
                <p className='font-semibold'>{item.label}</p>
                <RadioButton checked={item.value === selected?.value} inputId={item.name + '_' + item.value} />
            </div>

            <Divider className='border-100 border-top-1' />
        </div>
    );

    useImperativeHandle(ref, () => ({
        show,
    }));

    return (
        <Dialog
            header={title}
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
            <div className='flex flex-column'>{items.map(renderItem)}</div>
        </Dialog>
    );
});

SelectObjectModal.displayName = 'SelectObject Modal';

export default SelectObjectModal;
