<?php

namespace App\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Carbon\Carbon;
use Encore\Admin\Layout\Content;
use Encore\Admin\Facades\Admin;

class BuyMeCoffeeController extends Controller
{
    public function index(Content $content)
    {

        return $content
            ->view('admin.buy-me-coffee', []);
    }
}
