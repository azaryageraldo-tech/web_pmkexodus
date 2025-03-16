<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function index()
    {
        $galleries = Gallery::all();
        return response()->json([
            'data' => $galleries
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'image' => 'nullable|string'
        ]);

        $gallery = Gallery::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Gallery created successfully',
            'data' => $gallery
        ], 201);
    }

    public function show(Gallery $gallery)
    {
        return response()->json([
            'data' => $gallery
        ]);
    }

    public function update(Request $request, Gallery $gallery)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'image' => 'nullable|string'
        ]);

        $gallery->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Gallery updated successfully',
            'data' => $gallery
        ]);
    }

    public function destroy(Gallery $gallery)
    {
        $gallery->delete();

        return response()->json([
            'success' => true,
            'message' => 'Gallery deleted successfully'
        ]);
    }
}
