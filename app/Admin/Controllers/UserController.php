<?php

namespace App\Admin\Controllers;

use Encore\Admin\Auth\Database\Role;
use Encore\Admin\Controllers\UserController as EncoreUserController;

class UserController extends EncoreUserController
{
    protected function grid()
    {
        $grid = parent::grid();

        $grid->model()->orderBy('id', 'desc');
        $grid->column('parent_id', 'Tuyến trên');

        $grid->filter(function ($filter) {
            // Remove the default id filter
            $filter->disableIdFilter();
            // Add a column filter
            $filter->like('name', 'Tìm theo Tên');
            $filter->like('username', 'Tìm theo Username');

            // // Sử dụng callback để thêm filter theo roles
            // $filter->where(function ($query) use ($filter) {
            //     // Lọc dựa trên tên của vai trò từ bảng roles
            //     $query->whereHas('roles', function ($q) {
            //         $q->where('name', 'equal', '%{$this->input}%');
            //     });
            // }, 'Vai trò')->select(Role::all()->pluck('id')->label('name'));
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
