import type { route as routeFn } from 'ziggy-js';
import { Config, PageProps as InertiaPageProps } from '@inertiajs/core'

interface AuthProps {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'event_organizer' | 'participant';
}

declare global {
    const route: typeof routeFn;
    
    namespace Inertia {
        interface PageProps extends InertiaPageProps {
            auth: AuthProps;
            ziggy: Config & { location: string };
            errors: Record<string, string>;
        }
    }
}
