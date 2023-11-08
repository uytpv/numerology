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

            $filter->where(function ($q) {
                $role_id = $this->input;
                // Sử dụng hàm `whereIn` để tìm kiếm người dùng dựa trên role IDs
                $q->whereIn('id', function ($query) use ($role_id) {
                    $query->select('user_id')->from('admin_role_users')->where('role_id', $role_id);
                });
            }, 'Role')->select(Role::all()->pluck('name', 'id'));
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
