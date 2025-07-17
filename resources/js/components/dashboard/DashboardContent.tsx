import { type User } from '@/types';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface AdminDashboardStats {
    total_events_created: number;
    active_events: number;
    total_participants_registered: number;
    total_organizers_registered: number;
}

interface EventData {
    id: number;
    title: string;
    thumbnail_url?: string | null;
    description?: string;
    capacity?: number;
    contact_info?: string;
    social_share_link?: string | null;
    location: string;
    start_time: string; // parse to Date
    end_time: string;   // parse to Date
    is_paid?: boolean;
    price?: number | null;
    category?: { id: number; name: string }; // Relasi category
    organizer?: { id: number; name: string }; // Relasi organizer if loaded
}

interface ParticipantRegistrationData {
    id: number;
    event_id: number;
    user_id: number | null; // Null if guest
    name: string;
    email: string;
    status: 'pending' | 'confirmed' | 'checked_in' | 'cancelled';
    qr_code_data: string | null;
    registration_date: string; // parse to Date
    event: EventData; // Objek event 
    user?: { id: number; name: string; email: string } | null; // related user
}

interface AdminDashboardContentProps {
    user: User; // User object dari Inertia props
}

type DashboardStatsType = AdminDashboardStats | EventData[] | ParticipantRegistrationData[] | null;

export default function AdminDashboardContent({ user }: AdminDashboardContentProps) {
    const [stats, setStats] = useState<DashboardStatsType>(null); // Initialize stats state, save data from API
    const [loading, setLoading] = useState(true); // Initialize loading state
    const [error, setError] = useState<string | (null)>(null); // Initialize error state

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                let apiUrl = '';
                if (user.role === 'admin') {
                    apiUrl = '/api/admin/dashboard-stats';
                } else if (user.role === 'event_organizer') {
                    apiUrl = '/api/events'; // filtered for logged in EO
                } else if (user.role === 'participant') {
                    apiUrl = '/api/user/registered-events';
                }

                const response = await axios.get(apiUrl);
                setStats(response.data); // save received data
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError("Error fetching dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // useEffect depency only affect user.role
    }, [user.role]);

    if (loading) {
        return <p className="text-gray-700 dark:text-gray-300">Loading dashboard data...</p>;
    }

    if (error) {
        return <p className="text-red-600 dark:text-red-400">Error: {error}</p>;
    }
    // Only re-run the effect if user.role or user.name changes    

    // --- Render Konten Dashboard Berdasarkan Peran ---
    if (user.role === 'admin') {
        // Type assertion karena kita tahu 'stats' adalah AdminDashboardStats di sini
        const adminStats = stats as AdminDashboardStats;
        return (
            <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Welcome, {user.name}! 👋</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">This is your comprehensive system overview.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">Total Events Created</h4>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{adminStats.total_events_created}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">Active Events</h4>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">{adminStats.active_events}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">Total Participants</h4>
                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{adminStats.total_participants_registered}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">Total Organizers</h4>
                        <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{adminStats.total_organizers_registered}</p>
                    </div>
                </div>
                {/* ... Konten Admin lainnya ... */}
            </div>
        );
    } else if (user.role === 'event_organizer') {
        // Type assertion karena 'stats' adalah EventData[] di sini
        const eoEvents = stats as EventData[];
        return (
            <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Welcome, {user.name} (Event Organizer)! 🚀</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your events and participants efficiently.</p>

                {/* Contoh Widget Ringkasan Event Anda (bisa ditambahkan statik atau API baru) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">Total Events Created</h4>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{eoEvents.length}</p> {/* Contoh sederhana */}
                    </div>
                    {/* ... widget lainnya ... */}
                </div>

                {/* Contoh menampilkan event dari API */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm mt-6">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Current Active Events</h4>
                    {eoEvents.length === 0 ? (
                        <p className="mt-2 text-gray-600 dark:text-gray-400">No active events found.</p>
                    ) : (
                        <ul className="mt-2 text-gray-600 dark:text-gray-400">
                            {eoEvents.map(event => (
                                <li key={event.id} className="mb-2 p-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                                    - **{event.title}**
                                    <br />
                                    📅 {new Date(event.start_time).toLocaleDateString()} | Participants: {event.capacity}
                                    <br />
                                    [Button: Edit Event] [Button: View All Participants]
                                </li>
                            ))}
                        </ul>
                    )}
                    <button className="mt-4 text-blue-600 dark:text-blue-400 hover:underline">View All My Events</button>
                </div>
                {/* ... Konten Event Organizer lainnya ... */}
            </div>
        );
    } else if (user.role === 'participant') {
        // Type assertion karena 'stats' adalah ParticipantRegistrationData[] di sini
        const participantRegistrations = stats as ParticipantRegistrationData[];
        return (
            <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Welcome, {user.name} (Participant)! 👋</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Discover new events and manage your registrations.</p>

                {/* Contoh menampilkan registered events */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm mt-6">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Your Registered Events</h4>
                    {participantRegistrations.length === 0 ? (
                        <p className="mt-2 text-gray-600 dark:text-gray-400">You have no upcoming registered events.</p>
                    ) : (
                        <ul className="mt-2 text-gray-600 dark:text-gray-400">
                            {participantRegistrations.map(registration => (
                                <li key={registration.id} className="mb-2 p-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                                    - **{registration.event.title}**
                                    <br />
                                    📅 {new Date(registration.event.start_time).toLocaleDateString()} | {new Date(registration.event.start_time).toLocaleTimeString()}
                                    <br />
                                    📍 {registration.event.location}
                                    <br />
                                    [Status: {registration.status}] [Link: Ticket & Detail]
                                </li>
                            ))}
                        </ul>
                    )}
                    <button className="mt-4 text-blue-600 dark:text-blue-400 hover:underline">View All My Events</button>
                </div>
                {/* ... Konten Participant lainnya ... */}
            </div>
        );
    }
    return null; // Return null jika peran tidak cocok (misal: user belum login, walau seharusnya tidak terjadi di dashboard)
}
