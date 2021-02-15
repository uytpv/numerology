<?php

namespace App\Admin\Controllers;

use App\Models\Number;
use Encore\Admin\Controllers\AdminController;
use Encore\Admin\Form;
use Encore\Admin\Grid;
use Encore\Admin\Show;

class NumberController extends AdminController
{
    /**
     * Title for current resource.
     *
     * @var string
     */
    protected $title = 'Các con số';

    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        $grid = new Grid(new Number());

        $grid->column('number', __('Number'))->display(function () {
            return 'Xem Số ' . $this->number;
        })->width(100)->modal('NĂNG LƯỢNG CON SỐ', function ($data) {
            return view('admin/number', [
                'data' => $data
            ]);
        });

        $grid->column('image', __('Image'))->display(function ($image) {
            $ext = substr($image, - (strlen($image) - strpos($image, '.') - 1));
            return '<img src="' . env('APP_URL') . '/uploads/' . rtrim($image, '.' . $ext) . '-small.' . $ext . '" class="img img-thumbnail">';
        });
        $grid->disableFilter();
        $grid->disableRowSelector();
        $grid->disableColumnSelector();
        $grid->disableTools();
        $grid->disableExport();
        $grid->actions(function (Grid\Displayers\Actions $actions) {
            $actions->disableView();
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
        $show = new Show(Number::findOrFail($id));

        $show->field('id', __('Id'));
        $show->field('number', __('Number'));
        $show->field('name', __('Name'));
        $show->field('image', __('Image'));
        $show->field('description', __('Description'));
        $show->field('created_at', __('Created at'));
        $show->field('updated_at', __('Updated at'));

        return $show;
    }

    /**
     * Make a form builder.
     *
     * @return Form
     */
    protected function form()
    {
        $form = new Form(new Number());

        $form->number('number', __('Number'));
        $form->text('name', __('Name'));
        $form->image('image', __('Image'))->thumbnail('small', $width = 200, $height = 200);
        $form->ckeditor('description', __('Description'))->options(['lang' => 'en', 'height' => 500]);

        $form->disableEditingCheck();
        $form->disableCreatingCheck();
        $form->disableViewCheck();
        $form->tools(function (Form\Tools $tools) {
            $tools->disableDelete();
            $tools->disableView();
        });
        return $form;
    }
}
