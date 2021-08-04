<?php

use Illuminate\Routing\Router;

Admin::routes();

Route::group([
    'prefix'        => config('admin.route.prefix'),
    'namespace'     => config('admin.route.namespace'),
    'middleware'    => config('admin.route.middleware'),
    'as'            => config('admin.route.prefix') . '.',
], function (Router $router) {
    //GET
    $router->get('/', 'HomeController@index')->name('home');
    $router->get('showMap/{id}', 'CustomerController@showMap');
    $router->get('showDetail/{indicator}/{number}', 'IndicatorNumberController@showDetail');
    
    //RESOURCE
    $router->resource('customers', CustomerController::class);
    $router->resource('numbers', NumberController::class);
    $router->resource('indicators', IndicatorController::class);
    $router->resource('indicator-numbers', IndicatorNumberController::class);
    $router->resource('categories', CategoryController::class);
    $router->resource('document-types', DocumentTypeController::class);
    $router->resource('documents', DocumentController::class);
    
    //POST
    $router->post('customers/batch-update', 'CustomerController@updatePost');

    //API
    $router->get('/api/categories', 'CategoryController@categories');

});
