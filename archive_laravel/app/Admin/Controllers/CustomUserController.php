<?php

namespace App\Admin\Controllers;

use App\User;
use Encore\Admin\Grid;

class CustomUserController extends UserController
{
    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        $grid = new Grid(new User());

        $grid->filter(function ($filter) {
            // Remove the default id filter
            $filter->disableIdFilter();
            // Add a column filter
            $filter->like('last_name', 'Họ và chữ lót');
            $filter->like('first_name', 'Tên');
            $filter->like('note', 'Ghi chú');
        });
        return $grid;
    }
}
