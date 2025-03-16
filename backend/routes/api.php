<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\NewsController;
use Illuminate\Support\Facades\Route;

// Route publik (tanpa autentikasi)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Public data endpoints
Route::get('/public/members', [MemberController::class, 'index']);
Route::get('/public/news', [NewsController::class, 'index']);
Route::get('/public/galleries', [GalleryController::class, 'index']);

// Route yang memerlukan autentikasi
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Resources
    Route::apiResource('members', MemberController::class);
    Route::apiResource('news', NewsController::class);
    Route::apiResource('galleries', GalleryController::class);
});
