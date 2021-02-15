<?php

namespace App\Admin\Controllers;

use App\Models\Indicator;
use Encore\Admin\Controllers\AdminController;
use Encore\Admin\Form;
use Encore\Admin\Grid;
use Encore\Admin\Show;

class IndicatorController extends AdminController
{
    /**
     * Title for current resource.
     *
     * @var string
     */
    protected $title = 'Indicator';

    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        $grid = new Grid(new Indicator());

        $grid->column('name', __('Chỉ số'))->width(300)->modal('Ý NGHĨA CHỈ SỐ', function ($data) {
            return view('admin/indicator', [
                'data' => $data
            ]);
        });;
        $grid->column('eng_name', __('Tiếng Anh'))->width(300);
        // $grid->column('code', __('Code'))->width(300);
        $grid->column('short_description', __('Mô tả ngắn'))->width(300);

        $grid->column('id', 'Xem số')->display(function ($id) {
            return '<a href="' . env('APP_URL') . '/admin/indicator-numbers?indicator=' . Indicator::find($id)->code . '">Xem số</a>';
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
        $show = new Show(Indicator::findOrFail($id));

        $show->field('id', __('Id'));
        $show->field('name', __('Name'));
        $show->field('eng_name', __('Eng name'));
        $show->field('guide', __('Guide'));
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
        $form = new Form(new Indicator());

        $form->text('code', __('Code'))->rules('required', [
            'required' => 'Bắt buộc nhập'
        ]);
        $form->text('name', __('Chỉ số'))->rules('required', [
            'required' => 'Bắt buộc nhập'
        ]);
        $form->text('eng_name', __('Tiếng Anh'))->rules('required', [
            'required' => 'Bắt buộc nhập'
        ]);
        $form->textarea('short_description', __('Mô tả ngắn'))->rules('required', [
            'required' => 'Bắt buộc nhập'
        ]);
        $form->ckeditor('guide', __('Cách tính'))->options(['lang' => 'en', 'height' => 300])->rules('required', [
            'required' => 'Bắt buộc nhập'
        ]);
        $form->ckeditor('description', __('Mô tả ý nghĩa'))->options(['lang' => 'en', 'height' => 300])->rules('required', [
            'required' => 'Bắt buộc nhập'
        ]);

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
