<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EventController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:view-events')->only(['index', 'show', 'trashed']);
        $this->middleware('permission:create-events')->only('store');
        $this->middleware('permission:update-events')->only(['update', 'restore']);
        $this->middleware('permission:delete-events')->only(['destroy', 'forceDelete']);
    }

    public function index()
    {
        $events = Event::with(['category', 'user'])->paginate(10);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Events retrieved successfully',
            'data' => $events
        ]);
    }

    public function restore($id)
    {
        try {
            $event = Event::withTrashed()->findOrFail($id);
            $event->restore();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Event restored successfully',
                'data' => $event
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to restore event',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'location' => 'required|string|max:255',
                'start_date' => 'required|date_format:Y-m-d H:i:s',
                'end_date' => 'required|date_format:Y-m-d H:i:s|after:start_date',
                'image' => 'nullable|string|regex:/^data:image\/(jpeg|png|jpg|gif);base64,/',
                'category_id' => 'nullable|exists:categories,id'
            ]);
            
            $event = Event::create($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Event created successfully',
                'data' => $event->load('category')
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create event',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Event $event)
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Event retrieved successfully',
            'data' => $event
        ]);
    }

    public function update(Request $request, Event $event)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'location' => 'required|string|max:255',
                'start_date' => 'required|date_format:Y-m-d H:i:s',
                'end_date' => 'required|date_format:Y-m-d H:i:s|after:start_date',
                'image' => 'nullable|string|regex:/^data:image\/(jpeg|png|jpg|gif);base64,/',
                'category_id' => 'nullable|exists:categories,id'
            ]);
            
            $event->update($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Event updated successfully',
                'data' => $event->load('category')
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update event',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Event $event)
    {
        try {
            $event->delete();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Event deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete event',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function trashed()
    {
        try {
            $events = Event::onlyTrashed()->paginate(10);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Trashed events retrieved successfully',
                'data' => $events
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve trashed events',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function forceDelete($id)
    {
        try {
            $event = Event::withTrashed()->findOrFail($id);
            $event->forceDelete();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Event permanently deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to permanently delete event',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
