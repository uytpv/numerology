<?php

namespace App\Models;

use Encore\Admin\Traits\AdminBuilder;
use Encore\Admin\Traits\ModelTree;
use Illuminate\Database\Eloquent\Model;


class Category extends Model
{
    use ModelTree, AdminBuilder;

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->setParentColumn('parent_id');
        $this->setOrderColumn('order');
        $this->setTitleColumn('title');
    }

    protected $connection = 'mysql';

    protected $table = 'categories';

    protected $primaryKey = 'id';

    public $timestamps = true;

    protected $fillable = [
        'title',
        'order',
        'parent_id',
    ];

    protected $guarded = [];
    /**
     * API for getting all category
     * @param Request $request
     * @return
     */
    
}
