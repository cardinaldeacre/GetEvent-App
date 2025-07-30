import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';


export function AppHeader() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    return (
        <>
            <header className="shadow-sm p-2 flex items-center px-4 justify-between bg-[linear-gradient(to_right,#7226FF,#160078,#010030)]" >
                <div className="flex items-center">
                    <Link href={route('home')} className="flex ml-4 items-center text-lg font-bold text-white">
                        <img src="/images/logo-white.png" alt="GetEvent Logo" className="h-6 mr-1" />
                        GetEvent
                    </Link>
                </div>
                <div className="flex-1 text-white max-w-lg mx-4">
                    {/* Search Bar (Anda bisa membuatnya dinamis nanti) */}
                    <input
                        type="text"
                        placeholder="Search events..."
                        className="text-sm w-full px-2 py-1 border border-white text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div className="flex items-center space-x-12 mr-8">
                    <button className="px-2 pb-0.5 text-white text-md">ticket</button>
                    {user ? (
                        <>
                            <Link href={route('dashboard')} className=" px-2 pb-0.5 text-white hover:text-indigo-600 text-md">Dashboard</Link>
                            <Link href={route('logout')} method="post" as="button" className="text-red-600 hover:underline cursor-pointer">Logout</Link>
                        </>
                    ) : (
                        <>
                            <Link href={route('login')} className="border border-gray-300 rounded-sm px-2 pb-0.5 text-white dark:text-white hover:text-indigo-600">Login</Link>
                        </>
                    )}
                </div>
            </header>
        </>
    );
}
