<?php
    use  App\Models\IndicatorNumber;
    use  App\Models\Indicator;
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
                    <input class="form-control input-lg" type="text" name="fullname" id="email" placeholder="Họ tên đầy đủ" required />
                </div>
                <div class="form-group">
                    <label for="password">Ngày Sinh đầy đủ</label>
                    <input type="text" pattern="\d{1,2}/\d{1,2}/\d{4}" class="datepicker form-control input-lg" name="dob" placeholder="dd/mm/yyyy"/>

                </div>
                <div class="form-group">
                    <input type="submit" name="submit" class="btn btn-success btn-lg" value="Xem bản đồ" />
                </div>
            </form>
        </div>

	</section>
    @isset($map)
    <div class="row">
        <div class="col-sm-4">
            <div class="card text-center">
                <div class="card-body">
                    <h5 class="card-title">{{ Indicator::where(['code' => $map[0]->indicator])->first()->name }}</h5>
                    <div class="badge rounded-pill badge-outline-warning">{{ $map[0]->number }}</div>
                </div>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="card text-center">
                <div class="card-body">
                    <h5 class="card-title">{{ Indicator::where(['code' => $map[1]->indicator])->first()->name }}</h5>
                    <div class="badge rounded-pill badge-outline-warning">{{ $map[1]->number }}</div>
                </div>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="card text-center">
                <div class="card-body">
                    <h5 class="card-title">{{ Indicator::where(['code' => $map[8]->indicator])->first()->name }}</h5>
                    <div class="badge rounded-pill badge-outline-warning">{{ $map[8]->number }}</div>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-4">
            <div class="card text-center">
                <div class="card-body">
                    <h5 class="card-title">{{ Indicator::where(['code' => $map[3]->indicator])->first()->name }}</h5>
                    <div class="badge rounded-pill badge-outline-warning">{{ $map[3]->number }}</div>
                </div>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="card text-center">
                <div class="card-body">
                    <h5 class="card-title">{{ Indicator::where(['code' => $map[4]->indicator])->first()->name }}</h5>
                    <div class="badge rounded-pill badge-outline-warning">{{ $map[4]->number }}</div>
                </div>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="card text-center">
                <div class="card-body">
                    <h5 class="card-title">{{ Indicator::where(['code' => $map[7]->indicator])->first()->name }}</h5>
                    <div class="badge rounded-pill badge-outline-warning">{{ $map[7]->number }}</div>
                </div>
            </div>
        </div>
    </div>

    @endisset

@endsection
