'use client';

import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import '../../resources/styles/themes/light.css';
import './global.scss';

import ReduxProvider from '@assets/providers/ReduxProvider';
import { PageProps } from '@assets/types/UI';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { dir } from 'i18next';
import type { Metadata } from 'next';
import { PrimeReactProvider } from 'primereact/api';

export const metadata: Metadata = {
	title: 'Hệ thống xử lý tiến trình khóa luận tốt nghiệp 2',
};

const queryClient = new QueryClient();

export default function RootLayout({ children, params: { lng } }: PageProps) {
	return (
		<html
			lang={lng}
			dir={dir(lng)}
		>
			<ReduxProvider>
				<QueryClientProvider client={queryClient}>
					<PrimeReactProvider>{children}</PrimeReactProvider>
				</QueryClientProvider>
			</ReduxProvider>
		</html>
	);
}
