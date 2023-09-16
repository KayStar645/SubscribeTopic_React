'use client';

import styles from './MenuItem.module.scss';

import { MenuItemProps } from '@assets/types/menu';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { classNames } from 'primereact/utils';
import { useState } from 'react';

const MenuItem = ({ label, to = '', items, icon }: MenuItemProps) => {
	const [openMenu, setOpenMenu] = useState(false);

	const onClick = (e: any) => {
		if (!to) {
			e.preventDefault;
		}

		if (items) {
			setOpenMenu((prev) => !prev);
		}
	};

	return (
		<div>
			<Link
				className={classNames('flex align-items-center gap-2 py-3 px-3', styles['menu-item'], {
					[styles['active']]: openMenu,
				})}
				href={to}
				onClick={onClick}
			>
				<i
					className={classNames(icon || 'pi pi-circle', openMenu ? 'text-indigo-600' : 'text-gray-600')}
				></i>
				<p className={classNames(openMenu ? 'text-indigo-600 font-bold' : 'text-gray-800', 'flex-1')}>
					{label}
				</p>

				{items && items.length > 0 && <i className='pi pi-chevron-down text-sm'></i>}
			</Link>

			{items && (
				<div className={classNames(styles['sub-menu'], 'overflow-hidden')}>
					<motion.div
						animate={!openMenu ? { height: 0 } : { height: 'auto' }}
						transition={{ duration: 0.3 }}
					>
						<ul>
							{items!.map((child, i) => {
								return (
									<MenuItem
										key={child.label}
										label={child.label}
										icon={child.icon || 'pi pi-circle'}
										to={child.to}
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
