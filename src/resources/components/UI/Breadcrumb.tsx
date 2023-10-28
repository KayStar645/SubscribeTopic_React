import { language } from '@assets/helpers';
import { useDispatch } from '@assets/redux';
import menuSlice from '@assets/redux/slices/menu/slice';
import { LanguageType } from '@assets/types/lang';
import { useTranslation } from '@resources/i18n';
import _ from 'lodash';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaHouseChimney } from 'react-icons/fa6';

const Breadcrumb = ({ lng }: LanguageType) => {
    const pathName = usePathname();
    const { t } = useTranslation(lng);
    const pathItems = _.drop(pathName.split('/'), 2);
    const items = _.map(pathItems, (path) => ({
        path,
        label: t(`route:${path}`),
        url: language.addPrefixLanguage(lng, language.getChildPath(pathName, path)) || '#',
    }));
    const dispatch = useDispatch();
    const router = useRouter();

    const Home = ({ showArrow }: { showArrow: boolean }) => (
        <div
            key={items[0].label}
            className='flex align-items-center no-underline gap-2 text-primary font-semibold hover:text-blue-300 cursor-pointer'
            onClick={() => {
                onItemClick(items[0].path);
                router.push(items[0].url);
            }}
        >
            <FaHouseChimney />
            <p>{items[0].label}</p>
            {showArrow && <i className='pi pi-angle-right' />}
        </div>
    );

    const onItemClick = (label: string) => {
        dispatch(menuSlice.actions.onItemClick({ activeItem: label, parent: label, openMenu: true }));
    };

    return (
        <div className='border-round-lg flex align-items-center gap-2 bg-white'>
            {items.length > 1 ? (
                <>
                    {items.map((item, index) =>
                        index === 0 ? (
                            <Home showArrow={true} key={item.label} />
                        ) : (
                            <div
                                key={item.label}
                                className='flex align-items-center no-underline gap-2 font-semibold text-800 hover:text-600 cursor-pointer'
                                onClick={(e) => {
                                    onItemClick(item.path);
                                    router.push(item.url);
                                }}
                            >
                                {item.label}
                                {index !== items.length - 1 && <i className='pi pi-angle-right' />}
                            </div>
                        ),
                    )}
                </>
            ) : (
                <Home showArrow={false} />
            )}
        </div>
    );
};

export default Breadcrumb;
