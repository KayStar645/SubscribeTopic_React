import { AUTH_TOKEN, getAdminMenu } from '@assets/configs';
import { LanguageType } from '@assets/types/lang';
import { useTranslation } from '@resources/i18n';
import { getCookie, hasCookie } from 'cookies-next';
import { Image } from 'primereact/image';
import { MenuItem } from '../UI/MenuItem';

const Menu = ({ lng }: LanguageType) => {
    const { t } = useTranslation(lng);
    const menu = getAdminMenu(t, lng);
    const user = hasCookie(AUTH_TOKEN) ? JSON.parse(getCookie(AUTH_TOKEN)!) : {};

    return (
        <div className='flex flex-column gap-2 bg-white w-19rem h-screen relative shadow-5 overflow-auto z-5'>
            <div className='w-full flex flex-column gap-2 align-items-center justify-content-center absolute bg-white z-1 shadow-1 h-11rem'>
                <Image
                    src={user?.shop?.image}
                    alt=''
                    imageClassName='border-circle shadow-5'
                    width='100'
                    height='100'
                />
                <p className='font-semibold text-blue-900 text-2xl'>{user.shop.name}</p>
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
