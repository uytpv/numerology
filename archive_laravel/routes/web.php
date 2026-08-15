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
    
<<<<<<< HEAD:archive_laravel/routes/web.php
    $router->get('/trang-chu', 'HomeController@HomePage'); // GET trang chủ cũ
    
    $router->post('/trang-chu', 'HomeController@showMap'); // POST trang chủ cũ
    $router->get('/pages/{page_name}', 'StaticPageController@index');
=======
    $router->get('/gjw', 'GJWController@index');
    
    //POST
    $router->post('/', 'HomeController@showMap'); // thêm tạm POST cho trang cũ để chạy sự kiện 10/12/2022
    $router->post('/trang-chu', 'HomeController@showMap');
>>>>>>> aef690af78cfe305b573fd5c9f68d0bf357f7bb9:routes/web.php
    // $router->get('showDetail/{indicator}/{number}', 'IndicatorNumberController@showDetail');


});
