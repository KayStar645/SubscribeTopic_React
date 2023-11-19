import { AUTH_RAW_TOKEN, AUTH_TOKEN } from '@assets/configs';
import { USER_MENU } from '@assets/configs/user_menu';
import { language } from '@assets/helpers';
import useCookies from '@assets/hooks/useCookies';
import { AuthType } from '@assets/interface/Auth';
import { useDispatch } from '@assets/redux';
import menuSlice from '@assets/redux/slices/menu/slice';
import { LanguageType } from '@assets/types/lang';
import { MenuItemType } from '@assets/types/menu';
import { SelectFacultyModalRefType } from '@assets/types/modal';
import { useTranslation } from '@resources/i18n';
import { deleteCookie } from 'cookies-next';
import { usePathname } from 'next/navigation';
import { Avatar } from 'primereact/avatar';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useRef } from 'react';
import { Breadcrumb, MenuItem } from '../UI';

const Header = ({ lng }: LanguageType) => {
    const { t } = useTranslation(lng);
    const [auth] = useCookies<AuthType>(AUTH_TOKEN);
    const userModalRef = useRef<OverlayPanel>(null);
    const pathName = usePathname();
    const menu = USER_MENU(t, lng, language.getRealPathName(pathName));
    const dispatch = useDispatch();
    const selectFacultyRef = useRef<SelectFacultyModalRefType>(null);

    const renderItem = (item: MenuItemType) => {
        const onLogoutClick = () => {
            deleteCookie(AUTH_TOKEN);
            deleteCookie(AUTH_RAW_TOKEN);
            dispatch(menuSlice.actions.onItemClick({ activeItem: 'home', openMenu: false, parent: '' }));
        };

        const onChangeFacultyClick = () => {
            selectFacultyRef.current?.show();
        };

        return (
            <MenuItem
                key={item.code}
                permissions={auth?.permission || []}
                item={{
                    ...item,
                    onItemClick: () => {
                        let event = () => {};

                        if (item.code === 'logout') {
                            event = onLogoutClick;
                        }

                        if (item.code === 'change_faculty') {
                            event = onChangeFacultyClick;
                        }

                        event();
                    },
                }}
            />
        );
    };

    return (
        <div
            className='flex align-items-center justify-content-between flex-1 h-4rem shadow-2 bg-white pr-4 absolute top-0 left-0 right-0'
            style={{ zIndex: 500, paddingLeft: '20rem' }}
        >
            <Breadcrumb lng={lng} />

            <div className='flex align-items-center justify-content-end gap-6' style={{ marginRight: '-0.5rem' }}>
                <div className='flex align-items-center gap-2'>
                    <Avatar icon='pi pi-bell' className='bg-primary text-white border-circle' />
                    <p>{t('notification')}</p>
                </div>
                <div
                    className='flex align-items-center gap-2 hover:surface-hover cursor-pointer p-2 border-round-lg'
                    onClick={(e) => userModalRef?.current?.toggle(e)}
                >
                    <Avatar icon='pi pi-user' className='bg-primary text-white border-circle' />
                    <p>{auth?.customer.Name}</p>

                    <i className='pi pi-angle-down ml-2' />
                </div>

                <OverlayPanel ref={userModalRef} className='px-2 py-1'>
                    {menu.map(renderItem)}
                </OverlayPanel>
            </div>

            {/* <SelectFacultyModal
                ref={selectFacultyRef}
                lng={lng}
                onConfirm={(item) => {
                    setCookie(FACULTY_TOKEN, item);
                }}
            /> */}
        </div>
    );
};

export default Header;
