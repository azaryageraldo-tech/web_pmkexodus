<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    public function index()
    {
        $news = News::latest()->get();
        return response()->json([
            'status' => 'success',
            'data' => $news
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|string'
        ]);

        $news = News::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'News created successfully',
            'data' => $news
        ], 201);
    }

    public function show(News $news)
    {
        return response()->json([
            'status' => 'success',
            'data' => $news
        ]);
    }

    public function update(Request $request, News $news)
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'content' => 'string',
            'image' => 'nullable|string'
        ]);

        $news->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'News updated successfully',
            'data' => $news
        ]);
    }

    public function destroy(News $news)
    {
        $news->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'News deleted successfully'
        ]);
    }
}
