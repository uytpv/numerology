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
    $router->get('documents', 'NDocumentController@index');
    $router->get('statistic', 'StatisticController@index');

    //RESOURCE
    $router->resource('customers', CustomerController::class);
    $router->resource('numbers', NumberController::class);
    $router->resource('indicators', IndicatorController::class);
    $router->resource('indicator-numbers', IndicatorNumberController::class);
    $router->resource('categories', CategoryController::class);
    $router->resource('document-types', DocumentTypeController::class);
    $router->resource('ndocuments', DocumentController::class);
    //override route quản lý danh sách admin đến custom UserController override
    $router->resource('auth/users', UserController::class);

    //POST
    $router->post('customers/batch-update', 'CustomerController@updatePost');

    //API
    $router->get('/api/categories', 'CategoryController@categories');
    $router->get('/api/getDocuments', 'NDocumentController@get');
});
