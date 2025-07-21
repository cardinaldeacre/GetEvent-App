import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    const [recomendedEvents, setRecomendedEvents] = useState<EventData[]>([]);
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
                setRecomendedEvents(remainingEvents.slice(0, 8)); // take 8 for 'for you'
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
            </div>
        </Link>
    );

    return (
        <>

        </>
    );
}
