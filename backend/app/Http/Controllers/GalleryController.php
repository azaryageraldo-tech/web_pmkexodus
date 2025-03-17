<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GalleryController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:view-galleries')->only(['index', 'show']);
        $this->middleware('permission:create-galleries')->only('store');
        $this->middleware('permission:update-galleries')->only('update');
        $this->middleware('permission:delete-galleries')->only('destroy');
    }

    public function index()
    {
        $galleries = Gallery::with('user')->paginate(10);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Galleries retrieved successfully',
            'data' => $galleries
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'image' => 'required|string'
            ]);

            $gallery = Gallery::create($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Gallery created successfully',
                'data' => $gallery
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create gallery',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Gallery $gallery)
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Gallery retrieved successfully',
            'data' => $gallery
        ]);
    }

    public function update(Request $request, Gallery $gallery)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'image' => 'required|string'
            ]);

            $gallery->update($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Gallery updated successfully',
                'data' => $gallery
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update gallery',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Gallery $gallery)
    {
        try {
            $gallery->delete();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Gallery deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete gallery',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
