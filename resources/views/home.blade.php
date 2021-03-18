@extends('layout.master')

@section('content')
	<section class="visual">
        <h2>Họ Tên và Ngày Sinh của bạn nói lên điều gì?</h2>
        <div class="container">

            <form class="myForm" method="post">
                <div class="form-group">
                    <label for="email">Họ tên đầy đủ</label>
                    <input class="form-control input-lg" type="text" name="fullname" id="email" placeholder="fullname" />
                </div>
                <div class="form-group">
                    <label for="password">Ngày Sinh đầy đủ</label>
                    <input class="form-control input-lg" type="text" name="dob" placeholder="dd/mm/yyyy" />
                </div>
                <div class="form-group">
                    <input type="submit" name="submit" class="btn btn-success btn-lg" value="Xem bản đồ" />
                </div>
            </form>
        </div>

	</section>

@endsection
