import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppHeader } from '@/components/app-header';
import { error } from 'console';

interface EventData {
    id: number;
    title: string;
    thumbnail_url: string;
    location: string;
    start_time: string;
    is_paid: boolean;
    price: number | null;
    category: {
        name: string;
    };
}

interface CategoryData {
    id: number;
    name: string;
    description: string;
}

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    const [eventOnThisWeek, setEventOnThisWeek] = useState<EventData[]>([]);
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [recommendedEvents, setRecommendedEvents] = useState<EventData[]>([]);
    const [popularEvents, setPopularEvents] = useState<EventData[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [errorEvents, setErrorEvents] = useState<string | null>(null);

    // fetxhing data

    useEffect(() => {
        const fetchEventsAndCategories = async () => {
            setLoadingEvents(true);
            setErrorEvents(null);

            try {
                // fetch static categories
                const categoriesResponse = await axios.get<CategoryData[]>('api/categories');
                setCategories(categoriesResponse.data);

                // fetch events 
                const eventsResponse = await axios.get<EventData[]>('api/events');
                const allEvents = eventsResponse.data;

                // events on this week 
                const now = new Date();
                const endOfWeek = new Date();
                endOfWeek.setDate(now.getDate() + 7);

                const onThisWeek = allEvents.filter(event => {
                    const eventDate = new Date(event.start_time);
                    return eventDate >= now && eventDate <= endOfWeek;
                }).slice(0, 2); // top 2

                // for you 
                const remainingEvents = allEvents.filter(event => !onThisWeek.includes(event));
                setEventOnThisWeek(onThisWeek);
                setRecommendedEvents(remainingEvents.slice(0, 8)); // take 8 for 'for you'
            }
            catch (err) {
                console.error('Failed to fetching events or categories: ', err);
                setErrorEvents('Failed to fetch events, try again later.');
            } finally {
                setLoadingEvents(false);
            }
        };

        fetchEventsAndCategories();
    }, []); // effectt run once the component mounted

    // event card

    const EventCard: React.FC<{ event: EventData }> = ({ event }) => (
        <Link href={route('event.show', { event: event.id })} className='block rounded-lg overflow-hidden shadow-md hover:shadow-lg transtition-shadow duration-300 bg-white dark:bg-gray-800'>
            <img
                src={event.thumbnail_url || 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={event.title}
                className='w-full h-40 object-cover'
            />
            <div className="p-4">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 ">{event.category.name}</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">{event.title}</h3>
                <p className='text-sm text-gray-700 dark:text-gray-300 mt-2'>
                    📅 {new Date(event.start_time).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })
                    }
                </p>
                <p className='text-sm text-gray-700 dark:text-gray-300'>
                    📍 {event.location}
                </p>
                <p className='text-md font-semibold text-indigo-600 dark:text-indigo-400 mt-2'>
                    {event.is_paid ? `IDR ${event.price?.toLocaleString('id-ID')}` : 'Free'}
                </p>
            </div>
        </Link>
    );

    return (
        <>
            <Head title='Welcome' />
            <AppHeader />

            <section className='relative h-96 bg-cover bg-center flex items-center justify-center text-white'
                style={{ backgroundImage: 'url("/images/home.png")' }}>
                {/* <div className="absolute inset-0 bg-black opacity-50"></div> */}
            </section>

            {/* category icons */}
            <section className="py-8  bg-[linear-gradient(to_right,#7226FF,#160078,#010030)]">
                <div className="container mx-auto px-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                    {loadingEvents ? (
                        <p>Loading categories...</p>
                    ) : errorEvents ? (
                        <p>{errorEvents}</p>
                    ) : (
                        categories.map(category => (
                            <div key={category.id} className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
                                <svg className="w-10 h-10 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.79 2-4 2s-4-.895-4-2 1.79-2 4-2 4 .895 4 2zm-9 0c0 1.105-1.79 2-4 2s-4-.895-4-2 1.79-2 4-2 4 .895 4 2zM9 15v-6l12-3v6" />
                                </svg>
                                <span className="mt-2 text-sm text-gray-800 dark:text-gray-200">{category.name}</span>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* events on this week */}
            <section className='py-8 container mx-auto px-4'>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Event on this week</h2>
                {loadingEvents ? (
                    <p>Loading events</p>
                ) : errorEvents ? (
                    <p className='text-red-500'>No event found</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {eventOnThisWeek.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                )}
            </section>

            {/* for you */}
            <section className='py-8 container mx-auto px-4'>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">For you</h2>
                {loadingEvents ? (
                    <p>Loading events...</p>
                ) : errorEvents ? (
                    <p className='text-red-500'>Error loading events</p>
                ) : recommendedEvents.length === 0 ? (
                    <p className='text-gray-700 dark:text-gray-300'>No recommended events found</p>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                        {recommendedEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                )}
            </section>

            {/* explore more */}
            <section className='py-8 container mx-auto px-4'>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6" >Explore More</h2>

                {loadingEvents ? (
                    <p>Loading popular events...</p>
                ) : errorEvents ? (
                    <p className='text-red-500'>Error loading events</p>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                        {recommendedEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                )}
                <div className="text-center mt-8">
                    <button className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">Load more events</button>
                </div>
            </section>

            <footer className="bg-gray-900 text-white p-2 text-center">
                <p>&copy; {new Date().getFullYear()} GetEvent. All rights reserved.</p>
            </footer>
        </>
    );
}
