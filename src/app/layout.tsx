import { PageProps } from '@assets/types/UI';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Hệ thống xử lý tiến trình khóa luận tốt nghiệp',
    icons: './favicon.ico',
};

const Layout = ({ children }: PageProps) => {
    return children;
};

export default Layout;
