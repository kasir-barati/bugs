import { ReactNode } from 'react';
import { Blog } from '../../pages/blog/Blog.page';
import { Home } from '../../pages/home/Home.page';
import { DesktopNavbar } from './DesktopNavbar.component';

export interface NavbarItem {
    text: string;
    href: string;
    component: ReactNode;
}

export const navBarItems: NavbarItem[] = [
    {
        text: 'Home',
        href: '/',
        component: <Home />,
    },
    {
        text: 'Blog',
        href: '/blog',
        component: <Blog />,
    },
];

export function Navbar() {
    return <DesktopNavbar />;
}
