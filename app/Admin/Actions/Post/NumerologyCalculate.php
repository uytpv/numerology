<?php

namespace App\Admin\Actions\Post;

use Encore\Admin\Actions\RowAction;
use Illuminate\Database\Eloquent\Model;

class NumerologyCalculate extends RowAction
{
    public $name = 'Xuất Map';

    public function handle(Model $model)
    {
        // $model ...

        // if (true) {
        //     return $this->response()->success('Success message.' . $model->first_name)->refresh();
        // } else {
        //     return $this->response()->error('Error message.')->refresh();
        // }
    }

    /**
     * @return  string
     */
    public function href()
    {
        return '/admin/showMap/' . $this->getKey();
    }
}
