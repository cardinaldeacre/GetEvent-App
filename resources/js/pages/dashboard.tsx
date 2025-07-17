import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

import AdminDashboardContent from '@/components/dashboard/AdminDashboardContent';
import EventOrganizerDashboardContent from '@/components/dashboard/EventOrganizerDashboardContent';
import ParticipantDashboardContent from '@/components/dashboard/ParticipantDashboardContent';

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
                {/* Menampilkan konten spesifik berdasarkan peran pengguna */}
                {user.role === 'admin' && <AdminDashboardContent user={user} />}
                {user.role === 'event_organizer' && <EventOrganizerDashboardContent user={user} />}
                {user.role === 'participant' && <ParticipantDashboardContent user={user} />}

                {/* Anda bisa menghapus PlaceholderPattern bawaan atau gunakan untuk loading state */}
                {/* Contoh: {!user.role && <p>Loading dashboard...</p>} */}
            </div>
        </AppLayout>
    );
}
