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

    //GET
    // $router->get('/', 'HomeController@index'); // tạm thời comment lại để update cho sự kiện 10/12/2022
    $router->get('/', 'HomeController@HomePage'); // tạm thời chạy trang cũ này cho sự kiên 10/12/2022
    $router->get('/trang-chu', 'HomeController@HomePage');
    $router->get('/pages/{page_name}', 'StaticPageController@index');
    
    //POST
    $router->post('/', 'HomeController@showMap'); // thêm tạm POST cho trang cũ để chạy sự kiện 10/12/2022
    $router->post('/trang-chu', 'HomeController@showMap');
    // $router->get('showDetail/{indicator}/{number}', 'IndicatorNumberController@showDetail');
});
