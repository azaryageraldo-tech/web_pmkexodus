<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class NewsController extends Controller
{
    public function index()
    {
        $news = News::all();
        return response()->json(['data' => $news]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $path = $image->store('news', 'public');
            $validated['image'] = $path;
        }

        $news = News::create($validated);
        return response()->json([
            'success' => true,
            'data' => $news
        ], 201);
    }

    public function show(News $news)
    {
        return response()->json(['data' => $news]);
    }

    public function update(Request $request, News $news)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        if ($request->hasFile('image')) {
            if ($news->image) {
                Storage::disk('public')->delete($news->image);
            }
            $image = $request->file('image');
            $path = $image->store('news', 'public');
            $validated['image'] = $path;
        }

        $news->update($validated);
        return response()->json(['data' => $news]);
    }

    public function destroy(News $news)
    {
        if ($news->image) {
            Storage::disk('public')->delete($news->image);
        }
        $news->delete();
        return response()->json(null, 204);
    }
}
