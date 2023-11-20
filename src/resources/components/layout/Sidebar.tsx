import { AUTH_TOKEN, ADMIN_MENU } from '@assets/configs';
import useCookies from '@assets/hooks/useCookies';
import { AuthType } from '@assets/interface/Auth';
import { LanguageType } from '@assets/types/lang';
import { useTranslation } from '@resources/i18n';
import LogoImage from '@resources/image/info/logo.png';
import Image from 'next/image';
import { MenuItem } from '../UI';

const Menu = ({ lng }: LanguageType) => {
    const { t } = useTranslation(lng);
    const menu = ADMIN_MENU(t, lng);
    const [auth] = useCookies<AuthType>(AUTH_TOKEN);

    return (
        <div
            className='flex flex-column gap-2 bg-white h-screen relative shadow-2'
            style={{ zIndex: 1000, minWidth: '19rem' }}
        >
            <div className='w-full flex flex-column gap-2 align-items-center justify-content-center absolute bg-white z-1 shadow-1 h-11rem'>
                <Image src={LogoImage} alt='' width={100} height={100} priority={true} />
                <p className='font-semibold text-blue-900 text-2xl'>{t('info:product_name')}</p>
            </div>

            <ul className='p-2 overflow-y-auto h-full' style={{ marginTop: 170 }}>
                {auth && menu.map((item) => <MenuItem key={item.code} item={item} permissions={auth.permission} />)}
            </ul>
        </div>
    );
};

export default Menu;
