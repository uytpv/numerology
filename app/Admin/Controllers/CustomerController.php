<?php

namespace App\Admin\Controllers;

use App\Admin\Actions\Post\NumerologyCalculate;
use App\Models\Customer;
use App\Models\Indicator;
use Encore\Admin\Controllers\AdminController;
use Encore\Admin\Form;
use Encore\Admin\Grid;
use Encore\Admin\Show;

use App\Admin\Controllers\ShowMapController;
use Encore\Admin\Layout\Column;
use Encore\Admin\Layout\Content;
use Encore\Admin\Layout\Row;
use Illuminate\Routing\Route;

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

        $grid->column('last_name', __('Họ và chữ lót'));
        $grid->column('first_name', __('Tên'));
        $grid->column('dob', __('Ngày sinh'))->display(function () {
            return date('d-m-Y', strtotime($this->dob));
        });
        $grid->column('phone', __('Số điện thoại'));
        $grid->column('email', __('Email'));
        $grid->column('created_at', __('Created at'))->hide();
        $grid->column('updated_at', __('Updated at'))->hide();

        $grid->actions(function ($actions) {

            $actions->disableDelete();
            $actions->disableView();
            $actions->add(new NumerologyCalculate);
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
        $form->datetime('dob', __('Ngày Sinh'))->default(date('Y-m-d'))->rules('required', [
            'required' => 'Bắt buộc nhập'
        ]);
        $form->email('email', __('Email'))->rules('required', [
            'required' => 'Bắt buộc nhập'
        ]);
        $form->mobile('phone', __('Số điện thoại'))->rules('required', [
            'required' => 'Bắt buộc nhập'
        ]);

        $form->saved(function (Form $form) {
            $map = [];

            array_push($map, [
                'indicator' => 'life_path',
                'number' => Indicator::LifePathCalc($form->model())
            ]);
            array_push($map, [
                'indicator' => 'expression',
                'number' => Indicator::ExpressionCalc($form->model())
            ]);
            array_push($map, [
                'indicator' => 'lpe_bridge',
                'number' => Indicator::total(Indicator::LifePathCalc($form->model()) - Indicator::ExpressionCalc($form->model()))
            ]);
            array_push($map, [
                'indicator' => 'heart_desire',
                'number' => Indicator::HeartDesireCalc($form->model())
            ]);
            array_push($map, [
                'indicator' => 'personality',
                'number' => Indicator::PersonalityCalc($form->model())
            ]);
            array_push($map, [
                'indicator' => 'hdp_bridge',
                'number' => abs(Indicator::HeartDesireCalc($form->model()) - Indicator::PersonalityCalc($form->model()))
            ]);
            array_push($map, [
                'indicator' => 'balance',
                'number' => Indicator::BalanceCalc($form->model())
            ]);
            array_push($map, [
                'indicator' => 'birthday',
                'number' => Indicator::BirthdayCalc($form->model())
            ]);
            array_push($map, [
                'indicator' => 'maturity',
                'number' => Indicator::total(Indicator::LifePathCalc($form->model()) + Indicator::ExpressionCalc($form->model()))
            ]);
            array_push($map, [
                'indicator' => 'karmic_lessons',
                'number' => Indicator::KarmicLessonsCalc($form->model())
            ]);
            array_push($map, [
                'indicator' => 'rational_thought',
                'number' => Indicator::RationalThoughtCalc($form->model())
            ]);
            array_push($map, [
                'indicator' => 'subconscious_confidence',
                'number' => 9 - sizeof(Indicator::KarmicLessonsCalc($form->model()))
            ]);
            array_push($map, [
                'indicator' => 'hidden_passion',
                'number' => Indicator::HiddenPassionCalc($form->model())
            ]);
            array_push($map, [
                'indicator' => 'challennge',
                'number' => Indicator::ChallengeAndPinnacleCalc($form->model())['challenge']
            ]);
            array_push($map, [
                'indicator' => 'pinnacle',
                'number' => Indicator::ChallengeAndPinnacleCalc($form->model())['pinnacle']
            ]);
            array_push($map, [
                'indicator' => 'year',
                'number' => Indicator::YearAndMonthCalc($form->model())
            ]);
            $cus = $form->model();
            $cus->map = json_encode($map);
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
                    $row->column(2, function (Column $column) {
                    });
                    $row->column(8, function (Column $column) use ($map) {
                        $column->append(view('admin.map', ['map' => $map]));
                    });
                    $row->column(2, function (Column $column) {
                    });
                }
            );
    }
}
