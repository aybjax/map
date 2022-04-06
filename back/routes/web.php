<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('database/seed', function() {
    echo Artisan::call('db:seed');
    return;
});
Route::get('database/migrate', function() {
    echo Artisan::call('migrate');
    return;
});

Route::get('{catchall}', function() {
    return view('app');
})->where('catchall', '.*');