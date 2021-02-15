<?php

namespace App\Admin\Controllers;

use App\Models\Indicator;
use App\Models\Number;
use App\Models\IndicatorNumber;
use Encore\Admin\Controllers\AdminController;
use Encore\Admin\Form;
use Encore\Admin\Grid;
use Encore\Admin\Show;

class IndicatorNumberController extends AdminController
{
    /**
     * Title for current resource.
     *
     * @var string
     */
    protected $title = 'IndicatorNumber';

    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        $grid = new Grid(new IndicatorNumber());

        $grid->column('indicator', __('Chỉ số'))->display(function () {
            return Indicator::where('code', '=', $this->indicator)->first()->name;
        });
        $grid->column('number', __('Number'));
        // $grid->column('short_description', __('Short description'));
        // $grid->column('description', __('Description'));

        $grid->filter(function ($filter) {
            // Remove the default id filter
            $filter->disableIdFilter();

            // Add a column filter
            $filter->equal('indicator')->select(Indicator::all()->pluck('name', 'code'));
            $filter->equal('number')->select(Number::all()->pluck('number', 'number'));
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
        $show = new Show(IndicatorNumber::findOrFail($id));

        $show->field('indicator', __('Chỉ số'))->as(function ($indicator) {
            return Indicator::where('code', '=', $indicator)->first()->name;
        });
        $show->field('number', __('Số'));
        $show->field('short_description', __('Mô tả ngắn'));
        $show->field('description', __('Ý nghĩa'))->unescape();
        return $show;
    }

    /**
     * Make a form builder.
     *
     * @return Form
     */
    protected function form()
    {
        $form = new Form(new IndicatorNumber());

        $form->text('indicator', __('Indicator'));
        $form->number('number', __('Number'));
        $form->text('short_description', __('Short description'));
        $form->ckeditor('description', __('Description'))->options(['lang' => 'en', 'height' => 300]);

        return $form;
    }

    public function showDetail($indicator, $number)
    {
        $entry = IndicatorNumber::where('indicator', '=', $indicator)
            ->where('number', '=', $number)->first();

        echo json_encode($entry);
    }
}
