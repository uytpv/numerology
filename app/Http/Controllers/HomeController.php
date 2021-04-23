<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Project;
use App\Product;
use Illuminate\Support\Facades\Request;

class HomeController extends Controller
{
    public function index()
    {
        return view('home')->with([]);
    }

    public function showMap(Request $request)
    {
        // dd(explode('/', $_POST['dob']));
        $dateArr = explode('/', $_POST['dob']);
        $fullname = $_POST['fullname'];

        $dob = date("$dateArr[2]-$dateArr[1]-$dateArr[0]");

        $arrName = explode(" ", $fullname);

        $customer = new Customer();
        $customer->first_name = array_pop($arrName);
        $customer->last_name =  implode(" ", $arrName);
        $customer->dob = $dob;
        $customer->map = json_encode(Customer::calculateMap($customer));
        $customer->admin_id = 0;
        $customer->save();
        return view('home')->with([
            'map' => json_decode($customer->map)
        ]);
    }
}
