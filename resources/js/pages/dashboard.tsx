import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

import DashboardContent from '@/components/dashboard/DashboardContent';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;

    // Since this is a protected route, we can be sure `auth.user` is not null.
    // The non-null assertion operator (!) tells TypeScript to treat it as non-nullable.
    const user = auth.user!;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                {<DashboardContent user={user} />}
            </div>
        </AppLayout>
    );
}
