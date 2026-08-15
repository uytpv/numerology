<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Number extends Model
{
    protected $table = 'numbers';
    protected $fillable = ['name', 'image', 'description', 'number', 'created_at', 'updated_at'];
}
