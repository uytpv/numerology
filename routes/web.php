<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Routing\Router;

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

Route::group([
], function (Router $router) {

    $router->get('/', 'HomeController@index');
    $router->post('/', 'HomeController@showMap');
    // $router->get('showDetail/{indicator}/{number}', 'IndicatorNumberController@showDetail');
});
