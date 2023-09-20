import { LoaderProps } from '@assets/types/UI';
import LoadingGif from '@resources/image/loading/kid.gif';
import Image from 'next/image';
import { classNames } from 'primereact/utils';

const Loader = ({ label, overlay, show = true }: LoaderProps) => {
	return show ? (
		<div
			className={classNames('flex align-items-center justify-content-center h-full w-full flex-1', {
				'absolute top-0 left-0 right-0 bottom-0 z-5': overlay,
			})}
			style={{ backgroundColor: overlay ? 'rgba(0,0,0, 0.2)' : 'transparent' }}
		>
			<Image
				src={LoadingGif}
				alt='2'
				width={130}
			/>

			{label && <p className='font-semibold text-xl'>{label}</p>}
		</div>
	) : null;
};

export default Loader;
