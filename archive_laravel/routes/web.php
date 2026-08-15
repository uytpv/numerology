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

    $router->get('/', 'HomeController@index'); // GET trang chủ mới
    $router->post('/', 'HomeController@showMap'); // POST trang chủ mới
    
    $router->get('/trang-chu', 'HomeController@HomePage'); // GET trang chủ cũ
    
    $router->post('/trang-chu', 'HomeController@showMap'); // POST trang chủ cũ
    $router->get('/pages/{page_name}', 'StaticPageController@index');
    // $router->get('showDetail/{indicator}/{number}', 'IndicatorNumberController@showDetail');
});
