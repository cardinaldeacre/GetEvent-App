<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy
{
    public function before(User $user, string $abilty): bool|null
    {
        // for super admin, all access  granted
        if ($user->role === "admin") {
            return true; // access granted
        }
        return null; // continue to other policies
    }

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // admin could view any user
        return $user->role === "admin";
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, User $model): bool
    {
        // admin could view another user
        // users could view his own profile
        return $user->role === "admin" || $user->id === $model->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // only admin could create user
        return $user->role === "admin";
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, User $model): bool
    {
        // admin could update another user
        // users could update his own profile
        return $user->role === 'admin' || $user->id === $model->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, User $model): bool
    {
        // only admin could delete another user
        // admin cant determinate himself
        return $user->role === 'admin' || $user->id === $model->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, User $model): bool
    {
        // admin could restore another user
        return $user->role === 'admin' || $user->id === $model->id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, User $model): bool
    {
        // only admin could forcedelete another user
        // admin cant determinate himself
        return $user->role === 'admin' && $user->id !== $model->id;
    }
}
