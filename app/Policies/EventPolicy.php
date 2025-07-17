<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class EventPolicy
{
    public function before(User $user, string $ability): bool|null
    {
        if ($user->role === "admin") {
            return true;
        }
        return null;
    }
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Event $event): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->role === "event_organizer";
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Event $event): bool
    {
        // admin could update all events
        // event organizer could update his very own events
        return $user->role === "admin" || ($user->role === "event_organizer" && $user->id === $event->user_id);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Event $event): bool
    {
        // admin could determinate all events
        // event organizer could determinate his very own events
        return $user->role === "admin" || ($user->role === "event_organizer" && $user->id === $event->user_id);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Event $event): bool
    {
        // admin could restore all events
        // event organizer could restore his very own events
        return $user->role === "admin" || ($user->role === "event_organizer" && $user->id === $event->user_id);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Event $event): bool
    {
        // admin could permanently delete all events 
        // event organizer could  permanently delete his very own events 
        return $user->role === "admin" || ($user->role === "event_organizer" && $user->id === $event->user_id);
    }
}
