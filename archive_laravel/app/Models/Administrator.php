<?php

use Encore\Admin\Auth\Database\Administrator as EncoreAdministrator;

class Administrator extends EncoreAdministrator
{
    public function __construct(array $attributes = [])
    {
        array_push($this->fillable, 'parent_id');
        parent::__construct($attributes);
    }
}
