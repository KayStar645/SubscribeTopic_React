import { PropsWithChildren, createContext, useState } from 'react';

const ModelContext = createContext({ show: () => {}, hide: () => {} });

const ModalProvider = ({ children }: PropsWithChildren) => {
	const [show, setShow] = useState(false);

	const value = {
		show: () => setShow(true),
		hide: () => setShow(false),
	};

	return (
		<ModelContext.Provider value={value}>
			{children}
			{show && <div className='modal fixed top-0 bottom-0 left-0 right-0 bg-white text-600'>hi</div>}
		</ModelContext.Provider>
	);
};

export { ModelContext, ModalProvider };
