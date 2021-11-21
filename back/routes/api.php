<?php

use App\Http\Controllers\CultureController;
use App\Http\Controllers\FieldController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/register', [UserController::class, 'register']);

Route::post('/login', [UserController::class , 'login'])
    ->name('login');

Route::group(['middleware' => 'auth:sanctum'], function() {
    Route::get('/field', [FieldController::class , 'index'])
        ->name('field.index');

    Route::get('/field/{field}', [FieldController::class , 'show'])
        ->name('field.show');

    Route::post('/field/seed', [FieldController::class , 'seedFields'])
        ->name('field.seedFields');

    Route::post('/field/reset', [FieldController::class , 'resetFields'])
            ->name('field.resetFields');

    Route::delete('/field/{field}', [FieldController::class , 'destroy'])
        ->name('field.destroy');
    
    Route::get('/culture', [CultureController::class , 'index'])
            ->name('culture.index');
    
    Route::post('/culture-check', [CultureController::class , 'checkCulture'])
            ->name('culture.check');

    Route::post('/culture-suggest', [FieldController::class , 'suggestCulture'])
            ->name('culture.suggest');
    
    Route::get('/all-suggest', [FieldController::class , 'allSuggested'])
            ->name('culture.all-suggest');

    Route::get('/suggestion/{culture_field}', [FieldController::class , 'getSuggested'])
            ->name('culture.suggested');
            
    Route::delete('/suggestion/{culture_field}', [FieldController::class , 'deleteSuggested'])
            ->name('culture.delete');
    
    Route::post('/suggestion/{culture_field}', [FieldController::class , 'acceptSuggested'])
            ->name('culture.accept-suggested');
});