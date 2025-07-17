<?php

namespace App\Policies;

use App\Models\Participant;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ParticipantPolicy
{
    public function before(User $user, string $ability)
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
        return $user->role === "admin";
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Participant $participant): bool
    {
        return $user->role === "admin" ||
            ($user->role === "event_organizer" && $user->id === $participant->user_id) ||
            ($user->role === "participant" && $user->id === $participant->user_id);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(?User $user): bool
    {
        // all user (included guest) could join the event
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Participant $participant): bool
    {
        return $user->role === "admin" || ($user->role === "event_organizer" && $user->id === $participant->user_id);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Participant $participant): bool
    {
        return $user->role === "admin" || ($user->role === "event_organizer" && $user->id === $participant->user_id);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Participant $participant): bool
    {
        return $user->role === "admin" || ($user->role === "event_organizer" && $user->id === $participant->user_id);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Participant $participant): bool
    {
        return $user->role === "admin" || ($user->role === "event_organizer" && $user->id === $participant->user_id);
    }
}
