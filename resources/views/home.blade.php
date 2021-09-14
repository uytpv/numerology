<?php
use App\Models\IndicatorNumber;
use App\Models\Indicator;
?>
@extends('layout.master')

@section('content')
    <section class="visual">
        <h2>Họ Tên và Ngày Sinh của bạn nói lên điều gì?</h2>
        <div class="container">

            <form class="myForm" method="post">
                {{ csrf_field() }}
                <div class="form-group">
                    <label for="email">Họ tên đầy đủ</label>
                    <input class="form-control input-lg" type="text" name="fullname" id="email" placeholder="Họ tên đầy đủ"
                        required />
                </div>
                <div class="form-group">
                    <label for="password">Ngày Sinh đầy đủ</label>
                    <input type="text" pattern="\d{1,2}/\d{1,2}/\d{4}" class="datepicker form-control input-lg" name="dob"
                        placeholder="dd/mm/yyyy" />

                </div>
                <div class="form-group">
                    <input type="submit" name="submit" class="btn btn-success btn-lg" value="Xem bản đồ" />
                </div>
            </form>
        </div>

    </section>
    @isset($customer)
        <div class="row">
            <div class="container" style="text-align: center">
                <h1>{{ $customer->last_name . ' ' . $customer->first_name }}
                    {{ $customer->dob === '01/01/1970' ? '' : '(' . $customer->dob . ')' }}</h1>
            </div>
        </div>
    @endisset

    @isset($map)

        <div class="row justify-content-md-center">
            <div class="container" style="margin:0 auto; position: relative">
                @if ($customer->dob === '01/01/1970')
                    <div id="cta" class="cta-footer">
                        <h5 class="btn btn-primary rounded">
                            {{ Indicator::where(['code' => $map[6]->indicator])->first()->name }}
                            <span class="badge rounded-pill badge-outline-warning"
                                style="font-size: 1.2em">{{ $map[6]->number }}</span>
                        </h5>
                    </div>
                @else
                    <div class="col-sm-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h5 class="card-title">
                                    {{ Indicator::where(['code' => $map[0]->indicator])->first()->name }}</h5>
                                <div class="badge rounded-pill badge-outline-warning">{{ $map[0]->number }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h5 class="card-title">
                                    {{ Indicator::where(['code' => $map[3]->indicator])->first()->name }}</h5>
                                <div class="badge rounded-pill badge-outline-warning">{{ $map[3]->number }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-3 ">
                        <div class="card text-center">
                            <div class="card-body">
                                <h5 class="card-title">
                                    {{ Indicator::where(['code' => $map[6]->indicator])->first()->name }}
                                </h5>
                                <div class="badge rounded-pill badge-outline-warning">{{ $map[6]->number }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h5 class="card-title">
                                    {{ Indicator::where(['code' => $map[10]->indicator])->first()->name }}</h5>
                                <div class="badge rounded-pill badge-outline-warning">{{ $map[10]->number }}</div>
                            </div>
                        </div>
                    </div>
                @endif
            </div>
        </div>

    @endisset

@endsection
