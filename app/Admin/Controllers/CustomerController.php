<?php

namespace App\Admin\Controllers;

use App\Admin\Actions\Post\NumerologyCalculate;
use App\Admin\Extensions\Tools\BatchUpdate;
use App\Models\Customer;
use App\Models\Indicator;
use Encore\Admin\Facades\Admin;
use Encore\Admin\Controllers\AdminController;

use Encore\Admin\Form;
use Encore\Admin\Grid;
use Encore\Admin\Show;

use Encore\Admin\Layout\Column;
use Encore\Admin\Layout\Content;
use Encore\Admin\Layout\Row;
use Illuminate\Http\Request;

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

        // Cho phép Administrator xem toàn bộ danh sách khách hàng
        if ($currentUserId != 1) {
            $grid->model()->where('admin_id', '=', $currentUserId)->orderBy('id', 'desc');
        }

        $grid->column('last_name', __('Họ và chữ lót'));
        $grid->column('first_name', __('Tên'));
        $grid->column('dob', __('Ngày sinh'))->hide();
        $grid->column('life_path', __('ĐĐ'))->label()->sortable();
        $grid->column('expression', __('SM'))->label()->sortable();
        $grid->column('heart_desire', __('LH'))->label()->sortable();
        $grid->column('subconscious_confidence', __('SMTT'))->label()->sortable();
        $grid->column('balance', __('CB'))->label()->sortable()->hide();
        $grid->column('rational_thought', __('TDLT'))->label()->sortable()->hide();
        // $grid->column('map', __('LP'))->display(function ($map) {
        //     return json_decode($this->map)[0]->number;
        // })->label();
        $grid->column('phone', __('Số điện thoại'))->hide();
        $grid->column('email', __('Email'))->hide();
        $grid->column('note', __('Ghi chú'))->hide();
        $grid->column('created_at', __('Created at'))->hide();
        $grid->column('updated_at', __('Updated at'))->hide();
        $grid->column('Xuất MAP')->display(function () {

            return '<a href="' . env('APP_URL') . '/admin/showMap/' . $this->getKey() . '" class="btn btn-sm btn-info" title="Show Map">
            <i class="fa fa-download"></i><span class="hidden-xs">&nbsp;&nbsp;Xuất MAP</span>
        </a>';
            // return '/admin/showMap/' . $this->getKey();
        });

        if ($currentUserId == 1) {
            $grid->column('admin_id', __('KH của ai'));
        }

        $grid->actions(function ($actions) {
            $actions->disableView();
            // $actions->add(new NumerologyCalculate);
        });

        $grid->tools(function ($tools) {
            $tools->batch(function ($batch) {
                $batch->disableDelete();
                $batch->add('Batch Update', new BatchUpdate());
            });
        });

        $grid->filter(function ($filter) {
            // Remove the default id filter
            $filter->disableIdFilter();
            // Add a column filter
            $filter->like('last_name', 'Họ và chữ lót');
            $filter->like('first_name', 'Tên');
            $filter->in('life_path', 'Đường Đời')->multipleSelect(Indicator::getIndicatorWithMasterArr());
            $filter->in('expression', 'Sứ Mệnh')->multipleSelect(Indicator::getIndicatorWithMasterArr());
            $filter->in('heart_desire', 'Linh Hồn')->multipleSelect(Indicator::getIndicatorWithMasterArr());
            $filter->like('note', 'Ghi chú');
        });
        return $grid;
    }

    /**
     * Make a show builder.
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

        // 20240516 Bổ sung 3 chỉ số mới Bài học | Thái độ | Thế hệ
        $form->hidden('lesson');
        $form->hidden('attitude');
        $form->hidden('generation');

        $form->saving(function (Form $form) {
        });

        $form->saved(function (Form $form) {;
            $cus = $form->model();
            $cus = Customer::calculateIndicators($form->model());
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
                function (Row $row) use ($customer) {
                    // $row->column(2, function (Column $column) {
                    // });
                    $row->column(6, function (Column $column) use ($customer) {
                        $column->append(view('admin.map', ['cus' => $customer]));
                    });
                    $row->column(6, function (Column $column) use ($customer) {
                        $column->append(view('admin.year', ['cus' => $customer]));
                    });
                }
            );
    }



    public function updatePost(Request $request)
    {
        foreach (Customer::find($request->get('ids')) as $cus) {
            $cus = Customer::calculateIndicators($cus);
            $cus->save();
        }
    }
}
