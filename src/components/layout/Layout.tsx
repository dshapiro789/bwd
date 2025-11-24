'use client';

import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import CustomCursor from '../common/CustomCursor';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <>
            <CustomCursor />
            <Header />
            <main>{children}</main>
            <Footer />
        </>
    );
}
