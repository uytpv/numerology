<?php

namespace App\Admin\Controllers;

use App\Models\Category;
use App\Models\Document;
use App\Models\DocumentType;
use Encore\Admin\Auth\Database\Administrator;
use Encore\Admin\Controllers\AdminController;
use Encore\Admin\Form;
use Encore\Admin\Grid;
use Encore\Admin\Show;
use Encore\Admin\Facades\Admin;

class DocumentController extends AdminController
{
    /**
     * Title for current resource.
     *
     * @var string
     */
    protected $title = 'Document';

    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        $grid = new Grid(new Document());
        $grid->column('title', __('Tên tài liệu'));
        $grid->column('link', __('Link'))->display(function () {
            return '<a href="' . $this->link . '" target="_blank" style="overflow-wrap: anywhere;">' . $this->link . '</a>';
        })->setAttributes(['width' => ' 300px']);
        $grid->column('type_id', __('Loại'))->display(function () {

            $type = DocumentType::where('id', $this->type_id)->first()->title;
            switch ($type) {
                case 'REC':
                    return '<span class="label label-danger">' . $type . '</span>';
                    break;
                case 'DOC':
                    return '<span class="label label-primary">' . $type . '</span>';
                    break;
                case 'CONTACT':
                    return '<span class="label label-success">' . $type . '</span>';
                    break;
                default:
                    return '<span class="label label-default">' . $type . '</span>';
            }
        })->sortable();
        $grid->column(__('Nhóm cha'))->display(function () {
            $pid = Category::where('id', $this->cate_id)->first()->parent_id;
            return Category::where('id', $pid)->first()->title;
        })->hide();
        $grid->column('cate_id', __('Nhóm tài liệu'))->display(function () {
            return Category::where('id', $this->cate_id)->first()->title;
        })->sortable();


        $grid->column('admin_id', __('Người tạo'))->display(function () {
            return Administrator::where('id', $this->admin_id)->first()->name;
        });

        $grid->column('note', __('Ghi chú'))->hide();
        $grid->column('created_at', __('Created at'))->hide();
        $grid->column('updated_at', __('Updated at'))->hide();


        $grid->filter(function ($filter) {
            $filter->disableIdFilter();

            
            $filter->like('title', 'Tên tài liệu');
            $filter->like('note', 'Ghi chú');
            $filter->in('cate_id', 'Nhóm tài liệu')->multipleSelect(Category::all()->pluck('title', 'id'));
            $filter->in('type_id', 'Loại tài liệu')->multipleSelect(DocumentType::all()->pluck('title', 'id'));
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
        $show = new Show(Document::findOrFail($id));

        $show->field('id', __('Id'));
        $show->field('cate_id', __('Cate id'));
        $show->field('type_id', __('Type id'));
        $show->field('admin_id', __('Admin id'));
        $show->field('title', __('Title'));
        $show->field('link', __('Link'));
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
        $form = new Form(new Document());

        $form->select('cate_id', __('Nhóm tài liệu'))->options(function ($id) {
            $cate = Category::find($id);

            if ($cate) {
                return [$cate->id => $cate->title];
            }
        })->ajax('/admin/api/categories');

        $form->select('type_id', __('Loại tài liệu'))->options(DocumentType::all()->pluck('title', 'id'));

        $form->hidden('admin_id')->value(Admin::user()->id);

        $form->text('title', __('Tên tài liệu'));
        $form->url('link', __('Link'));
        $form->text('note', __('Ghi chú'));
        return $form;
    }
}
