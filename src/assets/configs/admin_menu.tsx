import { MenuItemType } from '@assets/types/menu';
import { TFunction } from 'i18next';
import { FaBoxesStacked, FaHouseChimney } from 'react-icons/fa6';
import { ROUTES } from '.';

const getAdminMenu = (t: TFunction, lng: string): MenuItemType[] => {
    return [
        {
            code: 'home',
            label: t('menu:home'),
            icon: <FaHouseChimney />,
            parent: 'home',
            to: `/${lng}/${ROUTES.admin.home}`,
        },
        {
            code: 'master_data',
            label: t('menu:master_data'),
            parent: 'master_data',
            icon: <FaBoxesStacked />,
            items: [
                {
                    code: 'product',
                    parent: 'master_data',
                    label: 'Sản phẩm',
                    to: `/${lng}/home/${ROUTES.admin.product}`,
                },
                {
                    code: 'order',
                    parent: 'master_data',
                    label: 'Đơn hàng',
                    to: `/${lng}/home/${ROUTES.admin.order}`,
                },
            ],
        },
    ];
};

export { getAdminMenu };
