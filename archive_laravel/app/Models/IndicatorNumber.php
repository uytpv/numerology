<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $indicator
 * @property string $number
 * @property string $short_description
 * @property string $description
 * @property string $created_at
 * @property string $updated_at
 */
class IndicatorNumber extends Model
{
    protected $table = 'indicator_number';
    protected $fillable = ['indicator', 'number', 'short_description', 'description', 'created_at', 'updated_at'];
}
