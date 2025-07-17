<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Participant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str; // generate QR code data
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ParticipantController extends Controller
{
    use AuthorizesRequests;

    // event registration
    // POST /api/events/{event_id}/register
    public function registerEvent(Request $request, Event $event)
    {
        // validate regist
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
        ];

        if (!Auth::check()) {
            $rules['email'][] = Rule::unique('participants')->where(function ($query) use ($event) {
                return $query->where('event_id', $event->id);
            })->ignore($event->id, 'event_id');
        } else {
            if ($event->participants()->where('user_id', Auth::id())->exists()) {
                return response()->json(['message' => 'You are already registered for this event'], 400);
            }
        }

        $request->validate($rules);

        $participant = $event->participants()->create([
            'user_id' => Auth::id(), // Akan null jika tidak login
            'name' => $request->name,
            'email' => $request->email,
            'qr_code_data' => Str::random(32), // Generate unique string for QR code
            'status' => 'pending', // Default status
            'registration_date' => now(),
        ]);

        // send email to participant with QR

        return response()->json([
            'message' => 'Registration succesfull',
            'participant' => $participant->load($event),
        ], 201);
    }

    public function getRegisteredEvents(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $registeredEvents = Participant::where('user_id', $user->id)
            ->with('event.category', 'event.organizer')
            ->get();

        return response()->json($registeredEvents);
    }

    // view events participant
    // GET /api/events/{event_id}/participants
    public function getEventParticipants(Request $request, Event $event)
    {
        if (Auth::user()->role === 'event_organizer' && Auth::id() !== $event->user_id) {
            return response()->json(['message' => 'Unauthorized to view participants for this event.'], 403);
        }

        return response()->json($event->partivipants()->with('user')->get());
    }

    public function getLatestParticipantsForOrganizer(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'event_organizer') {
            return response()->json(['message' => 'Unauthorized. Only Event Organizers can access this.'], 403);
        }

        $organizerEventIds = $user->events()->pluck('id');

        $latestParticipants = Participant::whereIn('event_id', $organizerEventIds)
            ->with('event')
            ->orderByDesc('created_at')
            ->limit(5) // Ambil 5 peserta terbaru
            ->get();

        return response()->json($latestParticipants);
    }

    // view all user
    // GET /api/participants
    public function index(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized to view participants.'], 403);
        }

        return response()->json(Participant::with(['event', 'user'])->get());
    }

    // update status (EO / Admin)
    // PUT /api/participants/{id}/status
    public function updateStatus(Request $request, Participant $participant)
    {
        if (Auth::user()->role === 'event_organizer' && Auth::id() !== $participant->event->user_id) {
            return response()->json(['message' => 'Unauthorized to update participant status.'], 403);
        }

        $request->validate([
            'status' => ['required', 'string', Rule::in(['pending', 'confirmed', 'checked_in', 'cancelled'])],
        ]);

        $participant->update(['status' => $request->status]);

        return response()->json($participant->load('event'));
    }

    // delete pariticipant (EO / Admin)
    // DELETE /api/participants/{id} 
    public function destroy(Participant $participant)
    {
        if (Auth::user()->role === 'event_organizer' && Auth::id() !== $participant->event->user_id) {
            return response()->json(['message' => 'Unauthorized to delete participant.'], 403);
        }

        $participant->delete();

        return response()->json(['message' => 'Participant deleted successfully.']);
    }

}
