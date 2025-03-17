<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    public function index()
    {
        $members = Member::all();
        return response()->json([
            'status' => 'success',
            'data' => $members
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|unique:members',
            'photo' => 'nullable|image|max:2048'
        ]);

        $member = Member::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Member created successfully',
            'data' => $member
        ], 201);
    }

    public function show(Member $member)
    {
        return response()->json([
            'status' => 'success',
            'data' => $member
        ]);
    }

    public function update(Request $request, Member $member)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'position' => 'string|max:255',
            'phone' => 'string|max:20',
            'email' => 'email|unique:members,email,'.$member->id,
            'photo' => 'nullable|image|max:2048'
        ]);

        $member->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Member updated successfully',
            'data' => $member
        ]);
    }

    public function destroy(Member $member)
    {
        $member->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Member deleted successfully'
        ]);
    }
}
