'use client';

import '../../resources/styles/index.scss';

import ReduxProvider from '@assets/providers/ReduxProvider';
import { PageProps } from '@assets/types/UI';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { dir } from 'i18next';

import { locale, addLocale } from 'primereact/api';

const queryClient = new QueryClient();

locale('vi');

addLocale('vi', {
    firstDayOfWeek: 1,
    dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
    dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
    dayNamesMin: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
    monthNames: [
        'Tháng 1',
        'Tháng 2',
        'Tháng 3',
        'Tháng 4',
        'Tháng 5',
        'Tháng 6',
        'Tháng 7',
        'Tháng 8',
        'Tháng 9',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12',
    ],
    monthNamesShort: [
        'Thg 1',
        'Thg 2',
        'Thg 3',
        'Thg 4',
        'Thg 5',
        'Thg 6',
        'Thg 7',
        'Thg 8',
        'Thg 9',
        'Thg 10',
        'Thg 11',
        'Thg 12',
    ],
    today: 'Hôm nay',
    clear: 'Hủy',
});

export default function RootLayout({ children, params: { lng } }: PageProps) {
    return (
        <html lang={lng} dir={dir(lng)}>
            <ReduxProvider>
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            </ReduxProvider>
        </html>
    );
}
