import { PageProps } from '@assets/types/UI';
import { useTranslation } from '@resources/i18n';
import type { Metadata } from 'next';

export async function generateMetadata({ params: { lng } }: PageProps): Promise<Metadata> {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { t } = useTranslation(lng);

    return {
        title: t('route:notification'),
    };
}

const Layout = ({ children }: PageProps) => {
    return children;
};

export default Layout;
