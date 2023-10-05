<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Support\Facades\Request;

class HomeController extends Controller
{
    public function index()
    {
        return view('uxos/index')->with([]);
    }

    public function HomePage()
    {
        return view('home')->with([]);
    }

    public function showMap(Request $request)
    {
        // dd($_POST['dob']);
        $fullname = trim($_POST['fullname']);
        $arrName = explode(" ", $fullname);
        
        $customer = new Customer();
        $customer->first_name = array_pop($arrName);
        $customer->last_name =  implode(" ", $arrName);
        $customer->dob = $_POST['dob'] == "" ? "1/1/1970" : $_POST['dob'];
        $customer->map = json_encode(Customer::calculateMap($customer));
        $customer->admin_id = 0;
        // $customer->save(); // không lưu database để tránh dữ liệu rác
        return view('home')->with([
            'map' => json_decode($customer->map),
            'customer' => $customer
        ]);
    }
}
