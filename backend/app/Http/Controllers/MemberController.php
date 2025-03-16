<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class MemberController extends Controller
{
    public function index()
    {
        $members = Member::all();
        return response()->json(['data' => $members]);
    }

    public function store(Request $request)
    {
        try {
            Log::info('Request data:', $request->all());

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'position' => 'required|string|max:255',
                'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'bio' => 'nullable|string'
            ]);

            $member = Member::create($validated);
            
            Log::info('Member created:', $member->toArray());
            
            return response()->json([
                'success' => true,
                'message' => 'Member created successfully',
                'data' => $member
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating member: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create member',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Member $member)
    {
        return response()->json(['data' => $member]);
    }

    public function update(Request $request, Member $member)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'bio' => 'nullable|string'
        ]);

        if ($request->hasFile('photo')) {
            if ($member->photo) {
                Storage::disk('public')->delete($member->photo);
            }
            $photo = $request->file('photo');
            $path = $photo->store('members', 'public');
            $validated['photo'] = $path;
        }

        $member->update($validated);
        return response()->json(['data' => $member]);
    }

    public function destroy(Member $member)
    {
        if ($member->photo) {
            Storage::disk('public')->delete($member->photo);
        }
        $member->delete();
        return response()->json(null, 204);
    }
}
