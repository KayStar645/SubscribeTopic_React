import { language } from '@assets/helpers';
import { LanguageProps } from '@assets/types/lang';
import { useTranslation } from '@resources/i18n';
import _ from 'lodash';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Breadcrumb = ({ lng }: LanguageProps) => {
	const pathName = usePathname();
	const { t } = useTranslation(lng);
	const pathItems = _.drop(pathName.split('/'), 2);
	const items = _.map(pathItems, (path) => ({
		label: t(`route:${path}`),
		url: language.addPrefixLanguage(lng, language.getChildPath(pathName, path)) || '#',
	}));

	const Home = ({ showArrow }: { showArrow: boolean }) => (
		<Link
			key={items[0].label}
			href={items[0].url}
			className='flex align-items-center no-underline gap-2 text-blue-400 font-semibold hover:text-blue-300'
		>
			<i className='pi pi-home'></i>
			<p>{items[0].label}</p>
			{showArrow && <i className='pi pi-angle-right'></i>}
		</Link>
	);

	return (
		<div className='py-2 px-3 border-round-lg border-1 border-500 flex align-items-center gap-2 bg-white'>
			{items.length > 1 ? (
				<>
					{items.map((item, index) =>
						index === 0 ? (
							<Home
								showArrow={true}
								key={item.label}
							/>
						) : (
							<Link
								key={item.label}
								href={item.url}
								className='flex align-items-center no-underline gap-2 font-semibold text-800 hover:text-600'
							>
								{item.label}
								{index !== items.length - 1 && <i className='pi pi-angle-right'></i>}
							</Link>
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
