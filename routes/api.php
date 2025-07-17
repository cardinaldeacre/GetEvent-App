<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/events', [EventController::class, 'index']); // get all events 
Route::get('/events/{event}', [EventController::class, 'show']); // get event detial
Route::post('/events/{event}/register', [ParticipantController::class, 'registerEvent']); // register to event
Route::get('/categories', [CategoryController::class, 'index']); // get all categories

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [EventController::class, 'logout']);
    // Route::get('/user', [AuthController::class, 'user']); // get current logged user

    // Event Management (EO / Admin)
    Route::post('/events', [EventController::class, 'store']); // create new event
    Route::patch('/events/{event}', [EventController::class, 'update']); // update event
    Route::delete('/events/{event}', [EventController::class, 'destroy']);

    // Category Management (Admin)
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::patch('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

    // Participant Management (EO event / Admin)
    Route::get('/events/{event}/participants', [ParticipantController::class, 'getEventParticipants']); // get participants of an event
    Route::put('/participants/{event}/status', [ParticipantController::class, 'updateStatus']); //  uodate participant status
    Route::delete('/participants/{participant}', [ParticipantController::class, 'destroy']); //  delete participant

    // EO Management (Admin)
    Route::get('/organizers', [UserController::class, 'indexOrganizers']);
    Route::post('/organizers', [UserController::class, 'storeOrganizers']);
    Route::patch('/organizers/{user}', [UserController::class, 'updateOrganizer']);
    Route::delete('/organizers/{user}', [UserController::class, 'destroyOrganizer']);

    // global participants list (Admin)
    Route::get('/participants', [ParticipantController::class, 'index']); // get all participants
});
