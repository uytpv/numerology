<?php

use Illuminate\Routing\Router;

Admin::routes();

Route::group([
    'prefix'        => config('admin.route.prefix'),
    'namespace'     => config('admin.route.namespace'),
    'middleware'    => config('admin.route.middleware'),
    'as'            => config('admin.route.prefix') . '.',
], function (Router $router) {

    $router->get('/', 'HomeController@index')->name('home');
    $router->resource('customers', CustomerController::class);
    $router->resource('numbers', NumberController::class);
    $router->resource('indicators', IndicatorController::class);
    $router->resource('indicator-numbers', IndicatorNumberController::class);
    $router->get('showMap/{id}', 'CustomerController@showMap');
    $router->get('showDetail/{indicator}/{number}', 'IndicatorNumberController@showDetail');

    $router->post('customers/batch-update', 'CustomerController@updatePost');
});
