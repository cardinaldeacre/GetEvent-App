import { type User } from '@/types';

interface ParticipantDashboardContentProps {
    user: User;
}

export default function ParticipantDashboardContent({ user }: ParticipantDashboardContentProps) {
    return (
        <div>
            <h2 className="text-2xl font-bold">Participant Dashboard</h2>
            <p>Welcome, {user.name}!</p>
            {/* Add Participant-specific dashboard widgets here */}
        </div>
    );
}
