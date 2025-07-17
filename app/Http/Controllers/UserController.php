<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{

    // viwe EO (Admin)
    // GET /api/organizers
    public function indexOrganizer()
    {
        return response()->json(User::where('role', 'event_organizer')->get());
    }

    // craete new EO (Admin)
    // POST /api/organizers 
    public function storeOrganizer(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $organizer = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'event_organizer',
        ]);

        return response()->json($organizer->only('id', 'name', 'email', 'role'), 201);
    }

    // PATCH /api/organizers/{id}
    public function updateOrganizer(Request $request, User $user)
    {
        if ($user->role !== 'event_organizer') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'sometimes|nullable|string|min:8|confirmed',
        ]);

        if ($request->has('password')) {
            $user->password = $request->password;
        }

        $user->update($request->except('password'));

        return response()->json($user->only('id', 'name', 'email', 'role'));
    }

    // DELETE /api/organizers/{id}
    public function destroyOrganizer(User $user)
    {
        if ($user->role !== 'event_organizer') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user->token()->delete();
        $user->delete();
    }
}
