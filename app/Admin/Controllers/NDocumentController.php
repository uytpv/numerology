<?php

namespace App\Admin\Controllers;

use App\Models\Article;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Document;
use Encore\Admin\Controllers\HasResourceActions;
use Encore\Admin\Form;
use Encore\Admin\Grid;
use Encore\Admin\Layout\Content;
use Encore\Admin\Show;
use Encore\Admin\Tree;

class NDocumentController extends Controller
{
    protected $title = 'Tài liệu Giao diện chỉ xem';

    /**
     * Index interface.
     *
     * @return Content
     */
    public function index(Content $content)
    {
        return $content
            ->title($this->title)
            ->body($this->customTreeView());
    }

    /**
     * Make a grid builder.
     *
     * @return Tree
     */
    protected function customTreeView()
    {

        return Category::tree(function (Tree $tree) {
            $views = array(
                'tree'   => 'admin.ndocument',
                'branch' => 'admin.tree.branch'
            );
            $tree->setView($views);
        });
    }

    public function get()
    {
        $cate_id = request()->get('cate_id');
        $doc_list = Document::where('cate_id',$cate_id)->get();
        $view = view("admin.list-document", compact('doc_list'))->render();
        return response()->json(['html' => $view]);

    }
}
