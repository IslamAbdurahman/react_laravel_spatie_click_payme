import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { auth } = usePage<{ auth: { user: any | null } }>().props;

    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        tg?.ready();
        tg?.expand();

        const user = tg?.initDataUnsafe?.user;

        if (!auth?.user && user) {
            fetch('/webapp-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute('content') || ''
                },
                body: JSON.stringify(user)
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.redirect) {
                        router.visit(data.redirect);
                    }
                })
                .catch(err => console.error('Telegram WebApp login error:', err));
        }
    }, [auth?.user]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppLayoutTemplate>
    );
};
