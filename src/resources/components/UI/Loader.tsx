import { LoaderProps } from '@assets/types/UI';
import { ProgressSpinner } from 'primereact/progressspinner';
import { classNames } from 'primereact/utils';

const Loader = ({ label = 'Loading...', show = true }: LoaderProps) => {
    return show ? (
        <div
            className={classNames(
                'flex align-items-center justify-content-center absolute top-0 left-0 right-0 bottom-0 gap-2',
            )}
            style={{ backgroundColor: 'rgba(0,0,0, 0.2)', zIndex: 9999 }}
        >
            <ProgressSpinner strokeWidth='8' animationDuration='0.8s' className='m-0 w-2rem h-2rem' />

            <p className='font-semibold text-xl'>{label}</p>
        </div>
    ) : null;
};

export default Loader;
