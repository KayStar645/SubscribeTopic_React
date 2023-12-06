import { language } from '@assets/helpers';
import { useDispatch } from '@assets/redux';
import menuSlice from '@assets/redux/slices/menu/slice';
import { LanguageType } from '@assets/types/lang';
import { useTranslation } from '@resources/i18n';
import _ from 'lodash';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaHouseChimney } from 'react-icons/fa6';
import qs from 'query-string';

interface BreadcrumbItemType {
    path: string;
    label: string;
    url: string;
    parent: string;
}

const Breadcrumb = ({ lng }: LanguageType) => {
    const { t } = useTranslation(lng);
    const pathName = usePathname();
    const pathItems = _.drop(pathName.split('/'), 2);
    const parent = pathItems[0];
    const dispatch = useDispatch();
    const router = useRouter();

    const items: BreadcrumbItemType[] = _.map(pathItems, (path) => ({
        path,
        parent,
        label: t(`route:${path}`),
        url: language.addPrefixLanguage(lng, language.getChildPath(pathName, path)) || '#',
    }));

    const Home = ({ showArrow }: { showArrow: boolean }) => (
        <Link
            href={items[0].url}
            key={items[0].label}
            className='flex align-items-center no-underline gap-2 text-primary font-semibold hover:text-blue-300 cursor-pointer'
            onClick={() => {
                onItemClick(items[0]);
            }}
        >
            <FaHouseChimney />
            <p>{items[0].label}</p>
            {showArrow && <i className='pi pi-angle-right' />}
        </Link>
    );

    const onItemClick = (item: BreadcrumbItemType) => {
        router.push(item.url + '?' + qs.stringify({ activeItem: item.path, parent: item.parent, openMenu: false }));

        dispatch(menuSlice.actions.onItemClick({ activeItem: item.path, parent: item.parent, openMenu: false }));
    };

    return (
        <div className='border-round-lg flex align-items-center gap-2 bg-white'>
            {items.length > 1 ? (
                items.map((item, index) =>
                    index === 0 ? (
                        <Home showArrow={true} key={item.label} />
                    ) : (
                        <div
                            key={item.label}
                            className='flex align-items-center no-underline gap-2 font-semibold text-800 hover:text-600 cursor-pointer'
                            onClick={() => {
                                onItemClick(item);
                            }}
                        >
                            {item.label == '0' ? t('create_new') : item.label}
                            {index !== items.length - 1 && <i className='pi pi-angle-right' />}
                        </div>
                    ),
                )
            ) : (
                <Home showArrow={false} />
            )}
        </div>
    );
};

export default Breadcrumb;
