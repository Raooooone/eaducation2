<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\QuizController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/me', [AuthController::class, 'updateProfile']);
    Route::put('/me/password', [AuthController::class, 'updatePassword']);

    Route::apiResource('courses', CourseController::class);
    Route::post('courses/{id}/join', [CourseController::class, 'join']);

    Route::post('/quizzes', [QuizController::class, 'store']);
    Route::get('/courses/{courseId}/quizzes', [QuizController::class, 'index']);
    Route::get('/quizzes/{id}', [QuizController::class, 'show']);
    Route::post('/quizzes/{quiz}/submit', [QuizController::class, 'submit']);
    Route::get('/teacher/quizzes/{quiz}/results', [QuizController::class, 'teacherQuizResults']);
});