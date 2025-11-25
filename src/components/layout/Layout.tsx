'use client';

import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import ScrollProgress from '../common/ScrollProgress';
import CursorGlow from '../common/CursorGlow';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <>
            <ScrollProgress />
            <CursorGlow />
            <Header />
            <main>{children}</main>
            <Footer />
        </>
    );
}
