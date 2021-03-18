<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
 * @property string $phone
 * @property string $email
 * @property string $dob
 * @property string $created_at
 * @property string $updated_at
 */
class Customer extends Model
{
    protected $table = 'customers';
    protected $fillable = ['fist_name', 'last_name', 'phone', 'email', 'dob', 'map', 'admin_id', 'created_at', 'updated_at'];
}
