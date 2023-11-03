<?php

namespace App\Admin\Controllers;

use Encore\Admin\Controllers\UserController as EncoreUserController;

class UserController extends EncoreUserController
{
    protected function grid()
    {
        $grid = parent::grid();
        $grid->column('parent_id', 'Tuyến trên');

        $grid->filter(function ($filter) {
            // Remove the default id filter
            $filter->disableIdFilter();
            // Add a column filter
            $filter->like('name', 'Tìm theo Tên');
            $filter->like('username', 'Tìm theo Username');
        });


        return $grid;
    }
    public function form()
    {
        $f = parent::form();
        $f->text('parent_id');
        return $f;
    }
}
