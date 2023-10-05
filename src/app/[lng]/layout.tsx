'use client';

import '../../resources/styles/index.scss';

import ReduxProvider from '@assets/providers/ReduxProvider';
import { PageProps } from '@assets/types/UI';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { dir } from 'i18next';
import { PrimeReactProvider } from 'primereact/api';

const queryClient = new QueryClient();

export default function RootLayout({ children, params: { lng } }: PageProps) {
    return (
        <html lang={lng} dir={dir(lng)}>
            <ReduxProvider>
                <QueryClientProvider client={queryClient}>
                    <PrimeReactProvider>{children}</PrimeReactProvider>
                </QueryClientProvider>
            </ReduxProvider>
        </html>
    );
}
