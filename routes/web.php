<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::get('/settings', [\App\Http\Controllers\UserSettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [\App\Http\Controllers\UserSettingController::class, 'store'])->name('settings.store');
    
    Route::resource('filaments', \App\Http\Controllers\FilamentController::class)->except(['create', 'show', 'edit', 'update']);
    Route::resource('consumables', \App\Http\Controllers\ConsumableController::class)->except(['create', 'show', 'edit', 'update']);
    Route::resource('clients', \App\Http\Controllers\ClientController::class)->except(['create', 'show', 'edit', 'update']);
    
    // Módulos do SaaS
    Route::resource('quotes', \App\Http\Controllers\QuoteController::class);
});

require __DIR__.'/auth.php';
