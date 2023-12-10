import { CustomImageProps } from '@assets/types/UI';
import { Image } from 'primereact/image';
import { useState } from 'react';

const CustomImage = (props: CustomImageProps) => {
    const { src } = props;

    const [active, setActive] = useState(src);

    return (
        <Image
            {...props}
            src={active}
            alt='Not working now'
            onError={() => {
                setActive('https://placehold.co/600x400');
            }}
        />
    );
};

export default CustomImage;
