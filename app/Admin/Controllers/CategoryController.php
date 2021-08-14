<?php

namespace App\Admin\Controllers;

use App\Models\Category;
use Encore\Admin\Controllers\AdminController;
use Encore\Admin\Form;
use Encore\Admin\Layout\Content;
use Encore\Admin\Tree;
use Illuminate\Http\Request;

class CategoryController extends AdminController
{
    protected $title = 'Phân nhóm tài liệu';

    /**
     * Index interface.
     *
     * @return Content
     */
    public function index(Content $content)
    {
        return $content
            ->title($this->title)
            ->body($this->tree());
    }

    /**
     * Make a grid builder.
     *
     * @return Tree
     */
    protected function tree()
    {
        return Category::tree();
    }

    /**
     * Make a form builder.
     *
     * @return Form
     */
    protected function form()
    {
        $form = new Form(new Category());
        $form->select('category_id')->options(Category::selectOptions());
        $form->text('title')->rules('required');

        return $form;
    }

    public function categories(Request $request)
    {
        $q = $request->get('q');
        return Category::where('title', 'like', "%$q%")->where('category_id', '>', 0)->paginate(null, ['id', 'title as text']);
    }

    /**
     * API for getting all parent category
     * @param Request $request
     * @return
     */
    public function parentCategories(Request $request)
    {
        $q = $request->get('q');
        return Category::where('category_id', '=', 0)->where('title', 'like', "%$q%")->paginate(null, ['id', 'title as text']);
    }
}
