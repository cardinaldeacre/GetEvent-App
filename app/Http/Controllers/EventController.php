<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class EventController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $this->authorize('view', Event::class);
        $query = Event::with(['category', 'organizer']);

        // filter search
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%')
                ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        // filter EO (only his event)
        if ($request->user() && $request->user()->role === 'event_organizer') {
            $query->where('user_id', $request->user()->id);
        }

        return response()->json($query->get());
    }

    // GET /api/events/{id}
    public function show(Event $event)
    {
        $this->authorize('view', Event::class);
        $event->load(['category', 'organizer']);
        return response()->json($event);
    }

    // POST /api/events
    public function store(Request $request)
    {
        $this->authorize('create', Event::class);

        if (Auth::user()->role !== 'event_organizer') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'thumbnail_url' => 'nullable|url|max:255', // or use file upload handling
            'description' => 'required|string',
            'capacity' => 'required|integer|min:1',
            'contact_info' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'social_share_link' => 'nullable|url|max:255',
            'location' => 'required|string|max:255',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after_or_equal:start_time',
            'is_paid' => 'boolean',
            'price' => 'nullable|numeric|min:0|required_if:is_paid,true',
        ]);

        $event = Auth::user()->events()->create($request->all());

        return response()->json($event, 201);
    }

    public function update(Request $request, Event $event)
    {
        $this->authorize('update', Event::class);

        if (Auth::user()->role === 'event_organizer' && Auth::id() !== $event->user_id) {
            return response()->json(['message' => 'Unathorized to update']);
        }

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'thumbnail_url' => 'sometimes|nullable|url|max:255',
            'description' => 'sometimes|required|string',
            'capacity' => 'sometimes|required|integer|min:1',
            'contact_info' => 'sometimes|required|string|max:255',
            'category_id' => 'sometimes|required|exists:categories,id',
            'social_share_link' => 'sometimes|nullable|url|max:255',
            'location' => 'sometimes|required|string|max:255',
            'start_time' => 'sometimes|required|date',
            'end_time' => 'sometimes|required|date|after_or_equal:start_time',
            'is_paid' => 'sometimes|boolean',
            'price' => 'sometimes|nullable|numeric|min:0|required_if:is_paid,true',
        ]);

        $event->update($request->all());

        return response()->json($event);
    }

    public function destroy(Event $event)
    {
        $this->authorize('delete', Event::class);
        $event->delete();

        return response()->json(['message' => 'Event deleted succesfully']);
    }
}
