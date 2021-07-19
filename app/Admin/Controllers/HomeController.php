<?php

namespace App\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Carbon\Carbon;
use Encore\Admin\Layout\Content;
use Encore\Admin\Facades\Admin;

class HomeController extends Controller
{
    public function index(Content $content)
    {
        $currentUserId = Admin::user()->id;
        // start range 7 days ago
        $start = date('z') + 1;
        // end range 7 days from now
        $end = date('z') + 1 + 7;

        // dd($start, $end);

        $today_birthday_customers = Customer::where('admin_id', '=', $currentUserId)->whereMonth('dob', '=', Carbon::now()->format('m'))->whereDay('dob', '=', Carbon::now()->format('d'))->get();
        $tomorow_birthday_customers = Customer::where('admin_id', '=', $currentUserId)->whereMonth('dob', '=', Carbon::now()->format('m'))->whereDay('dob', '=', Carbon::now()->addDay()->format('d'))->get();
        $nextweek_birthday_customers = Customer::orderBy('dob', 'asc')->where('admin_id', '=', $currentUserId)->whereRaw("DAYOFYEAR(dob) BETWEEN $start AND $end")->get();
        return $content
            ->title('Dashboard')
            ->description('Description...')
            ->view('admin.home', [
                'today_birthday_customers' => $today_birthday_customers,
                'tomorow_birthday_customers' => $tomorow_birthday_customers,
                'nextweek_birthday_customers' => $nextweek_birthday_customers
            ]);
    }
}
