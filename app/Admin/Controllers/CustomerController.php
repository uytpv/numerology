<?php

namespace App\Admin\Controllers;

use App\Admin\Actions\Post\NumerologyCalculate;
use App\Models\Customer;
use App\Models\Indicator;
use Encore\Admin\Facades\Admin;
use Encore\Admin\Controllers\AdminController;
use Encore\Admin\Auth\Database\Administrator;

use Encore\Admin\Form;
use Encore\Admin\Grid;
use Encore\Admin\Show;

use Encore\Admin\Layout\Column;
use Encore\Admin\Layout\Content;
use Encore\Admin\Layout\Row;

class CustomerController extends AdminController
{
    /**
     * Title for current resource.
     *
     * @var string
     */
    protected $title = 'Khách hàng';

    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        $grid = new Grid(new Customer());
        $currentUserId = Admin::user()->id;

        $grid->model()->where('admin_id', '=', $currentUserId)->orderBy('id', 'desc');

        $grid->column('last_name', __('Họ và chữ lót'));
        $grid->column('first_name', __('Tên'));
        $grid->column('dob', __('Ngày sinh'))->display(function () {
            return date('d-m-Y', strtotime($this->dob));
        })->hide();
        $grid->column('map', __('LP'))->display(function ($map) {
            return json_decode($this->map)[0]->number;
        })->label();
        $grid->column('phone', __('Số điện thoại'))->hide();
        $grid->column('email', __('Email'))->hide();
        $grid->column('created_at', __('Created at'))->hide();
        $grid->column('updated_at', __('Updated at'))->hide();

        $grid->actions(function ($actions) {
            $actions->disableView();
            $actions->add(new NumerologyCalculate);
        });

        $grid->filter(function ($filter) {

            // Remove the default id filter
            $filter->disableIdFilter();

            // Add a column filter
            $filter->like('last_name', 'Họ và chữ lót');
            $filter->like('first_name', 'Tên');
        });
        return $grid;
    }

    /**
     * Make a show builder.
     *
     * @param mixed $id
     * @return Show
     */
    protected function detail($id)
    {
        $show = new Show(Customer::findOrFail($id));

        $show->field('id', __('Id'));
        $show->field('last_name', __('Họ và chữ lót'));
        $show->field('first_name', __('Tên'));
        $show->field('email', __('Email'));
        $show->field('phone', __('Phone'));
        $show->field('dob', __('Dob'));
        $show->field('created_at', __('Created at'));
        $show->field('updated_at', __('Updated at'));

        return $show;
    }

    public function getDataNascimentoAttribute($value)
    {
        return \Carbon\Carbon::parse($value)->format('d/m/Y');
    }

    public function setDataNascimentoAttribute($value)
    {
        $this->attributes['data_nascimento'] = \Carbon\Carbon::createFromFormat('d/m/Y', $value)->format('Y-m-d');
    }

    /**
     * Make a form builder.
     *
     * @return Form
     */
    protected function form()
    {
        $form = new Form(new Customer());

        $form->text('last_name', __('Họ và chữ lót'))->rules('required', [
            'required' => 'Bắt buộc nhập'
        ]);
        $form->text('first_name', __('Tên'))->rules('required', [
            'required' => 'Bắt buộc nhập'
        ]);

        $form->date('dob', __('Ngày Sinh'))->rules('required', [
            'required' => 'Bắt buộc nhập'
        ])->format('DD-MM-YYYY');

        $form->hidden('admin_id')->value(Admin::user()->id);

        // $form->email('email', __('Email'))->rules('required', [
        //     'required' => 'Bắt buộc nhập'
        // ]);
        // $form->mobile('phone', __('Số điện thoại'))->rules('required', [
        //     'required' => 'Bắt buộc nhập'
        // ]);

        $form->saving(function (Form $form) {
            $arrDate = explode('-', $form->dob);
            $form->dob = $arrDate[2] . '-' . $arrDate[1] . '-' . $arrDate[0];
        });

        $form->saved(function (Form $form) {;
            $cus = $form->model();
            $cus->map = json_encode(Customer::calculateMap($form->model()));
            $cus->save();
        });

        $form->disableEditingCheck();
        $form->disableCreatingCheck();
        $form->disableViewCheck();
        $form->tools(function (Form\Tools $tools) {
            $tools->disableDelete();
            $tools->disableView();
        });
        return $form;
    }

    public function showMap($id, Content $content)
    {
        $customer = Customer::findOrFail($id);
        $map = json_decode($customer->map);

        return $content
            ->row(view('admin.title', compact('customer')))
            ->row(
                function (Row $row) use ($map) {
                    // $row->column(2, function (Column $column) {
                    // });
                    $row->column(6, function (Column $column) use ($map) {
                        $column->append(view('admin.map', ['map' => $map]));
                    });
                    $row->column(6, function (Column $column) use ($map) {
                        $column->append(view('admin.year', ['map' => $map]));
                    });
                }
            );
    }
}
