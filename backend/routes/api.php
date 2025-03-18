<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Public data endpoints
Route::get('/public/members', [MemberController::class, 'index']);
Route::get('/public/news', [NewsController::class, 'index']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Core resources only
    Route::apiResource('members', MemberController::class);
    Route::apiResource('news', NewsController::class);
    
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
});
