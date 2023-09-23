import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { MouseEvent, forwardRef, useImperativeHandle } from 'react';

interface ConfirmRef {
	show?: (event: MouseEvent, data: any, message: string) => void;
}

interface ConfirmType {
	agreeLabel?: string;
	cancelLabel?: string;
	acceptLabel?: string;
	rejectLabel?: string;
	onAccept?: (data: any) => void;
	onReject?: () => void;
}

const Confirm = forwardRef<ConfirmRef, ConfirmType>(
	({ acceptLabel, rejectLabel, onAccept, onReject }, ref) => {
		const show = (event: MouseEvent, data: any, message: string) => {
			confirmPopup({
				target: event.target as HTMLElement,
				message: message,
				icon: 'pi pi-info-circle',
				className: 'shadow-5',
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

export default Confirm;
export type { ConfirmRef };
