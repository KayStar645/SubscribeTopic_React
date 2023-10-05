import { ConfirmModalRefType, ConfirmModalType } from '@assets/types/modal';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { MouseEvent, forwardRef, useImperativeHandle } from 'react';

const ConfirmModal = forwardRef<ConfirmModalRefType, ConfirmModalType>(
    ({ acceptLabel, rejectLabel, onAccept, onReject }, ref) => {
        const show = (event: MouseEvent, data: any, message: string) => {
            confirmPopup({
                target: event.target as HTMLElement,
                message: message,
                icon: 'pi pi-info-circle',
                className: 'shadow-5',
                rejectClassName: 'bg-primary',
                acceptClassName: 'p-button-danger',
                acceptLabel: acceptLabel || 'Yes',
                rejectLabel: rejectLabel || 'No',
                accept: () => onAccept?.(data),
                reject: onReject,
            });
        };

        useImperativeHandle(ref, () => ({
            show,
        }));

        return <ConfirmPopup />;
    },
);

ConfirmModal.displayName = 'Confirm Modal';

export default ConfirmModal;
