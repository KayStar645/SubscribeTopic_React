import { getAdminMenu } from '@assets/configs';
import { LanguageType } from '@assets/types/lang';
import { useTranslation } from '@resources/i18n';
import LogoImage from '@resources/image/info/logo.png';
import Image from 'next/image';
import { MenuItem } from '../UI/MenuItem';

const Menu = ({ lng }: LanguageType) => {
    const { t } = useTranslation(lng);
    const menu = getAdminMenu(t, lng);

    return (
        <div className='flex flex-column gap-2 bg-white w-19rem h-screen relative shadow-2'>
            <div className='w-full flex flex-column gap-2 align-items-center justify-content-center absolute bg-white z-1 shadow-1 h-11rem'>
                <Image src={LogoImage} alt='' width={100} height={100} priority={false} />
                <p className='font-semibold text-blue-900 text-2xl'>{t('info:product_name')}</p>
            </div>

            <ul className='p-2 overflow-y-auto h-full' style={{ marginTop: 170 }}>
                {menu.map((item) => (
                    <MenuItem key={item.code} {...item} />
                ))}
            </ul>
        </div>
    );
};

export default Menu;
