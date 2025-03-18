<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\News;
use App\Models\Event;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats()
    {
        $stats = [
            'totalMembers' => Member::count(),
            'totalNews' => News::count(),
            'totalEvents' => Event::count(),
            'activeEvents' => Event::whereIn('status', ['upcoming', 'ongoing'])->count()
        ];

        return response()->json($stats);
    }
}