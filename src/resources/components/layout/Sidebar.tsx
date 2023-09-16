import menu from '@assets/configs/menu';
import MenuItem from '../UI/MenuItem/MenuItem';

const Menu = () => {
	return (
		<ul
			className='flex flex-column gap-2 p-2 overflow-y-auto w-19rem bg-white border-round-xl'
			style={{
				height: 'calc(100vh - 4rem)',
			}}
		>
			{menu.map((item) => (
				<MenuItem
					key={Math.random().toString()}
					label={item.label}
					icon={item.icon}
					to={item.to}
					items={item.items}
				/>
			))}
		</ul>
	);
};

export default Menu;
