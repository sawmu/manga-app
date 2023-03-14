import '~/styles/globals.scss';
import 'animate.css';
import '~/styles/magic.min.css';
import 'react-loading-skeleton/dist/skeleton.css';

import { SessionProvider } from 'next-auth/react';
import NextNProgress from 'nextjs-progressbar';
import { ReactElement, ReactNode } from 'react';
import { RecoilRoot } from 'recoil';
import MainLayout from '~/components/layouts/MainLayout';

import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

function MyApp({
    Component,
    pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore

    const getLayout =
        Component.getLayout ??
        ((page) => (
            <MainLayout showHeader showFooter>
                {page}
            </MainLayout>
        ));

    return (
        <SessionProvider session={session} refetchInterval={5 * 60}>
            <RecoilRoot>
                <NextNProgress color="#f43f5e" height={2} />
                {getLayout(<Component {...pageProps} />)}
            </RecoilRoot>
        </SessionProvider>
    );
}

export default MyApp;
