import { type User } from '@/types';

interface EventOrganizerDashboardContentProps {
    user: User;
}

export default function EventOrganizerDashboardContent({ user }: EventOrganizerDashboardContentProps) {
    return (
        <div>
            <h2 className="text-2xl font-bold">Event Organizer Dashboard</h2>
            <p>Welcome, {user.name}!</p>
            {/* Add Event Organizer-specific dashboard widgets here */}
        </div>
    );
}
