'use client';

import styles from './MenuItem.module.scss';

import { useDispatch, useSelector } from '@assets/redux';
import { selectMenu } from '@assets/redux/slices/menu';
import menuSlice from '@assets/redux/slices/menu/slice';
import { MenuItemProps } from '@assets/types/menu';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { classNames } from 'primereact/utils';

const MenuItem = (item: MenuItemProps) => {
	const { to, code, icon, items, label, labelClassName, iconClassName, itemClassName } = item;
	const dispatch = useDispatch();
	const menu = useSelector(selectMenu);
	const openMenu = menu.activeItem == code;
	const Icon = () => icon;

	const onClick = (e: any) => {
		if (!item.to) {
			e.preventDefault;
		}

		dispatch(menuSlice.actions.onItemClick({ activeItem: code }));

		if (code === menu.activeItem) {
			dispatch(menuSlice.actions.onItemClick({ activeItem: '' }));
		}
	};

	return (
		<div>
			<Link
				className={classNames(
					'flex align-items-center gap-2 py-2 px-3',
					styles['menu-item'],
					itemClassName,
					{
						[styles['active']]: openMenu,
					},
				)}
				href={to || ''}
				onClick={onClick}
			>
				<div className={classNames('p-1', iconClassName)}>
					<Icon />
				</div>
				<p
					className={classNames(
						openMenu ? 'text-indigo-600' : 'text-900',
						'flex-1 text-sm font-semibold',
						styles['item-label'],
						labelClassName,
					)}
				>
					{label}
				</p>

				{items && items.length > 0 && <i className='pi pi-chevron-down text-sm'></i>}
			</Link>

			{items && (
				<div className={classNames(styles['sub-menu'], 'overflow-hidden my-1 border-left-1 border-300')}>
					<motion.div
						animate={!openMenu ? { height: 0 } : { height: 'auto' }}
						transition={{ duration: 0.3 }}
					>
						<ul>
							{items!.map((child) => {
								return (
									<MenuItem
										key={child.label}
										code={child.code}
										label={child.label}
										icon={child.icon}
										to={child.to}
										itemClassName='ml-2'
										iconClassName='hidden'
									/>
								);
							})}
						</ul>
					</motion.div>
				</div>
			)}
		</div>
	);
};

export default MenuItem;
