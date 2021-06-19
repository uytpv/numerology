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
        $grid->column('note', __('Ghi chú'))->hide();
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
        ])->format('DD/MM/YYYY');

        $form->hidden('admin_id')->value(Admin::user()->id);
        $form->mobile('phone', __('Số điện thoại'));
        $form->email('email', __('Email'));
        
        $form->text('note', __('Ghi chú'));


        $form->hidden('life_path');
        $form->hidden('expression');
        $form->hidden('lpe_bridge');
        $form->hidden('heart_desire');
        $form->hidden('personality');
        $form->hidden('hdp_bridge');
        $form->hidden('balance');
        $form->hidden('birthday');
        $form->hidden('maturity');
        $form->hidden('karmic_lessons');
        $form->hidden('rational_thought');
        $form->hidden('subconscious_confidence');
        $form->hidden('hidden_passion');
        $form->hidden('challennge');
        $form->hidden('pinnacle');
        $form->hidden('age');
        $form->hidden('root');
        $form->hidden('year');
        $form->saving(function (Form $form){
            
        });
        
        $form->saved(function (Form $form) {;
            $cus = $form->model();
            $cus->map = json_encode(Customer::calculateMap($form->model()));

            $cus->life_path = Indicator::LifePathCalc($form->model());
            $cus->expression = Indicator::ExpressionCalc($form->model());
            $cus->lpe_bridge = abs(Indicator::totalIgnoreMaster($cus->life_path) - Indicator::totalIgnoreMaster($cus->expression));
            $cus->heart_desire = Indicator::HeartDesireCalc($form->model());
            $cus->personality = Indicator::PersonalityCalc($form->model());
            $cus->hdp_bridge = abs(Indicator::totalIgnoreMaster($cus->heart_desire) - Indicator::totalIgnoreMaster($cus->personality));
            $cus->balance = Indicator::BalanceCalc($form->model());
            $cus->birthday = Indicator::BirthdayCalc($form->model());
            $cus->maturity = Indicator::total($cus->life_path + $cus->expression);
            $cus->karmic_lessons = Indicator::KarmicLessonsCalc($form->model());
            $cus->rational_thought = Indicator::RationalThoughtCalc($form->model());
            $cus->subconscious_confidence = 9 - sizeof($cus->karmic_lessons);
            $cus->hidden_passion = Indicator::HiddenPassionCalc($form->model());
            $cus->challennge = Indicator::ChallengeAndPinnacleCalc($form->model())['challenge'];
            $cus->pinnacle = Indicator::ChallengeAndPinnacleCalc($form->model())['pinnacle'];
            $cus->age = Indicator::ChallengeAndPinnacleCalc($form->model())['age'];
            $cus->root = Indicator::ChallengeAndPinnacleCalc($form->model())['root'];
            $cus->year = Indicator::YearAndMonthCalc($form->model());

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
