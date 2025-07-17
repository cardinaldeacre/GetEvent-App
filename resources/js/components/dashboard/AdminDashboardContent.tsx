import { type User } from '@/types';

interface AdminDashboardContentProps {
    user: User;
}

export default function AdminDashboardContent({ user }: AdminDashboardContentProps) {
    return (
        <div>
            <h2 className="text-2xl font-bold">Admin Dashboard</h2>
            <p>Welcome, {user.name}!</p>
            {/* Add Admin-specific dashboard widgets here */}
        </div>
    );
}
