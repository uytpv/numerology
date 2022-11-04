<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\StoreCustomerRequest;
use App\Http\Requests\V1\UpdateCustomerRequest;
use App\Http\Resources\V1\CustomerResource;
use App\Models\Customer;
use App\Models\IndicatorNumber;
use App\Models\Indicator;
use Carbon\Carbon;
use Illuminate\Http\Request;

class CustomerApiController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return Customer::all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreCustomerRequest $request)
    {
        // kiểm tra Họ và tên Ngày sinh nếu tồn tại thì ko tạo mới nữa
        $c = Customer::where('first_name', '=', $request->first_name)
            ->where('last_name', '=', $request->last_name)
            ->whereDate('dob', '=', Carbon::createFromFormat('d/m/Y', $request->dob)->format('Y-m-d') . ' 00:00:00')->first();
        if ($c) {
            return $c;
        } else {
            $customer = new Customer();
            $customer->first_name = $request->first_name;
            $customer->last_name = $request->last_name;
            $customer->dob = $request->dob;

            $customer = Customer::calculateIndicators($customer);
            $customer->save();
            return new CustomerResource($customer);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Customer  $customer
     * @return \Illuminate\Http\Response
     */
    public function show(Customer $customer)
    {
        // return $customer
        // Đoạn này mặc định sẽ trả về object Customer nhưng vì 

        $map = [];
        $j = json_decode($customer['map']);
        for ($i = 0; $i < 13; $i += 1) {
            // $customer['map'][$i];

            $indicator = $j[$i]->indicator;
            $number = $j[$i]->number;

            $indicatorNumber = IndicatorNumber::where('indicator', '=', $indicator)->where('number', '=', $number)->first();

            $image = Indicator::where('code', '=', $indicator)->first()->image;
            $name = Indicator::where('code', '=', $indicator)->first()->name;

            $indicatorNumber->setAttribute('image', $image);
            $indicatorNumber->setAttribute('indicator_name', $name);

            $map[] =  $indicatorNumber;
        }
        return $map;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Customer  $customer
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        //
        $customer->first_name = $request->first_name;
        $customer->last_name = $request->last_name;
        $customer->dob = $request->dob;
        $customer = Customer::calculateIndicators($customer);
        $customer->update();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Customer  $customer
     * @return \Illuminate\Http\Response
     */
    public function destroy(Customer $customer)
    {
        //
    }
}
