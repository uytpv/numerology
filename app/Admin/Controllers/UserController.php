<?php

namespace App\Admin\Controllers;

use Encore\Admin\Auth\Database\Administrator;
use Encore\Admin\Auth\Database\Role;
use Encore\Admin\Controllers\UserController as EncoreUserController;
use Encore\Admin\Facades\Admin;

class UserController extends EncoreUserController
{
    protected function grid()
    {
        $grid = parent::grid();

        $grid->model()->orderBy('id', 'desc');

        $grid->parent_id('Người tạo tài khoản')->display(function () {
            $admin = Administrator::find($this->parent_id);
            if (isset($admin)) {
                return $admin->name;
            }
        })->sortable();

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

            $filter->in('parent_id', 'Tìm theo Người tạo')->select(Administrator::all()->pluck('name', 'id'));
        });
        return $grid;
    }
    public function form()
    {
        $form = parent::form();
        $form->hidden('parent_id')->value(Admin::user()->id);
        $form->ignore('permissions');
        return $form;
    }
}
