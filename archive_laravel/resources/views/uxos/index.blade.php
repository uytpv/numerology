<?php
use App\Models\IndicatorNumber;
use App\Models\Indicator;
?>
@extends('uxos.layout.master')

@section('content')
    <div class="hero_area">
        @include('uxos.layout.header')

        <!-- Nếu là trang chủ thì mới có slider slider section -->
        <section class=" slider_section position-relative">
            <div class="container">
                <div class="row">
                    <div class="col-md-7">
                        <div class="detail-box">
                            <h2>
                                Tính ngay 5 chỉ số <br /> Khám phá bí quyết
                            </h2>
                            <h1>
                                làm chủ cuộc đời
                            </h1>
                            <div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-5">
                        <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
                            <div class="carousel-inner">
                                <div class="carousel-item active">
                                    <div class="img-box">
                                        <div class="bg-img">
                                            <p>Nhập họ tên và ngày sinh để khám phá MIỄN PHÍ 5 chỉ số quan trọng nhất của
                                                bản đồ năng lượng các con số!</p>
                                            <form method="post">
                                                {{ csrf_field() }}
                                                <div class="form-group">
                                                    <label for="email">Họ tên đầy đủ</label>
                                                    <input class="form-control input-lg" type="text" name="fullname"
                                                        id="email" placeholder="Họ tên đầy đủ" required />
                                                </div>
                                                <div class="form-group">
                                                    <label for="password">Ngày Sinh đầy đủ</label>
                                                    <input type="text" pattern="\d{1,2}/\d{1,2}/\d{4}"
                                                        class="datepicker form-control input-lg" name="dob"
                                                        placeholder="dd/mm/yyyy" />

                                                </div>
                                                <div class="form-group">
                                                    <input type="submit" name="submit" class="btn_show_map"
                                                        value="Xem bản đồ" />
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button"
                                data-slide="prev">
                                <span class="sr-only">Previous</span>
                            </a>
                            <a class="carousel-control-next" href="#carouselExampleIndicators" role="button"
                                data-slide="next">
                                <span class="sr-only">Next</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- end slider section -->
    </div>
    <!-- feature section -->
    <section class="feature_section layout_padding2 layout_margin">
        <div class="container">
            <div class="heading_container">
                <h2>
                    Bí Mật Năng Lượng <br />
                    Các Con Số
                </h2>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-md-4">
                    <div class="box">
                        <div class="head-box">
                            <div class="img-box">
                                <img src="vendor/uxos/images/numerology-2.jpg" width="80" height="80" />
                            </div>
                            <h6>
                                Thấu Hiểu Bản Thân
                            </h6>
                        </div>
                        <div class="detail-box">
                            <p>
                                Cung cấp phương pháp để hiểu bản thân mình hơn thông qua phân tích năng lượng các con số.
                                Điều này có thể giúp mỗi người tìm hiểu về các ưu điểm và khuyết điểm của mình, và tìm ra
                                cách phát triển bản thân mình hơn.
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="box">
                        <div class="head-box">
                            <div class="img-box">
                                <img src="vendor/uxos/images/numerology-1.jpg" width="80" height="80" />
                            </div>
                            <h6>
                                Xây Dựng Mối Quan Hệ
                            </h6>
                        </div>
                        <div class="detail-box">
                            <p>
                                Giúp mọi người hiểu hơn về mối quan hệ của họ với người khác từ các tính toán suy luận dựa
                                trên năng lượng các con số. Điều này có thể giúp họ hiểu rõ hơn về cách họ có thể hòa hợp
                                với người khác và cách để xây dựng mối quan hệ tốt hơn.
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="box">
                        <div class="head-box">
                            <div class="img-box">
                                <img src="vendor/uxos/images/numerology-3.jpg" width="80" height="80" />
                            </div>
                            <h6>
                                Thiết Kế Cuộc Đời
                            </h6>
                        </div>
                        <div class="detail-box">
                            <p>
                                Phương pháp này cũng cung cấp các suy luận về sự kiện tương lai của mỗi cá nhân dựa trên
                                ngày, tháng, năm cá nhân và chặng. Điều này có thể giúp họ chuẩn bị cho các sự kiện tương
                                lai và tự thiết kế cuộc đời cho riêng mình.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-center">
            <a href="">
                Read More
            </a>
        </div>
    </section>

    <!-- end feature section -->

    <!-- download section -->

    <section class="download_section layout_padding-bottom">
        <div class="container">
            <div class="heading_container">
                <h2>
                    Năng lượng các con số
                </h2>
            </div>
            <div class="layout_padding2-top">
                <div class="row">
                    <div class="col-md-4">
                        <div class="box">
                            <div class="head-box">
                                <div class="img-box">
                                    <img src="http://amunselect.test/uploads/images/1-small.png" alt="" />
                                </div>
                                <p>Lãnh đạo là kim chỉ nam</p>
                            </div>
                        </div>
                        <div class="box">
                            <div class="head-box">
                                <div class="img-box">
                                    <img src="http://amunselect.test/uploads/images/1-small.png" alt="" />
                                </div>
                                <p>Lãnh đạo là kim chỉ nam</p>
                            </div>
                        </div>
                        <div class="box">
                            <div class="head-box">
                                <div class="img-box">
                                    <img src="http://amunselect.test/uploads/images/1-small.png" alt="" />
                                </div>
                                <p>Lãnh đạo là kim chỉ nam</p>
                            </div>
                        </div>
                        <div class="box">
                            <div class="head-box">
                                <div class="img-box">
                                    <img src="http://amunselect.test/uploads/images/1-small.png" alt="" />
                                </div>
                                <p>Lãnh đạo là kim chỉ nam</p>
                            </div>
                        </div>
                        <div class="box">
                            <div class="head-box">
                                <div class="img-box">
                                    <img src="http://amunselect.test/uploads/images/1-small.png" alt="" />
                                </div>
                                <p>Lãnh đạo là kim chỉ nam</p>
                            </div>
                        </div>
                        <div class="box">
                            <div class="head-box">
                                <div class="img-box">
                                    <img src="http://amunselect.test/uploads/images/1-small.png" alt="" />
                                </div>
                                <p>Lãnh đạo là kim chỉ nam</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="main-img-box">
                            <img src="{{ env('APP_URL') }}/vendor/uxos/images/download-img.png" alt="" />
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="box">
                            <div class="head-box">
                                <div class="img-box">
                                    <img src="http://amunselect.test/uploads/images/1-small.png" alt="" />
                                </div>
                                <p>Lãnh đạo là kim chỉ nam</p>
                            </div>
                        </div>
                        <div class="box">
                            <div class="head-box">
                                <div class="img-box">
                                    <img src="http://amunselect.test/uploads/images/1-small.png" alt="" />
                                </div>
                                <p>Lãnh đạo là kim chỉ nam</p>
                            </div>
                        </div>
                        <div class="box">
                            <div class="head-box">
                                <div class="img-box">
                                    <img src="http://amunselect.test/uploads/images/1-small.png" alt="" />
                                </div>
                                <p>Lãnh đạo là kim chỉ nam</p>
                            </div>
                        </div>
                        <div class="box">
                            <div class="head-box">
                                <div class="img-box">
                                    <img src="http://amunselect.test/uploads/images/1-small.png" alt="" />
                                </div>
                                <p>Lãnh đạo là kim chỉ nam</p>
                            </div>
                        </div>
                        <div class="box">
                            <div class="head-box">
                                <div class="img-box">
                                    <img src="http://amunselect.test/uploads/images/1-small.png" alt="" />
                                </div>
                                <p>Lãnh đạo là kim chỉ nam</p>
                            </div>
                        </div>
                        <div class="box">
                            <div class="head-box">
                                <div class="img-box">
                                    <img src="http://amunselect.test/uploads/images/1-small.png" alt="" />
                                </div>
                                <p>Lãnh đạo là kim chỉ nam</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- end download section -->

    <!-- about section -->
    <section class="about_section layout_padding">
        <div class="container">
            <div class="heading_container d-flex justify-content-lg-start">
                <h2>
                    About Us
                </h2>
            </div>
            <div class="layout_padding2-top">
                <div class="row">
                    <div class="col-md-5">
                        <div class="detail-box b-1">
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                                labore et dolore magna
                            </p>
                            <a href="">
                                Read More
                            </a>
                        </div>
                    </div>
                    <div class="col-md-5">
                        <div class="detail-box b-2">
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                                labore et dolore magna
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- end about section -->

    <!-- subscribe section -->
    <section class="subscribe_section layout_padding">
        <div class="container">
            <div class="heading_container">
                <h2>
                    Subscribe For Updates
                </h2>
            </div>
            <form action="" class="layout_padding2-top">
                <input type="email" placeholder="Enter your email" />
                <button>
                    subscribe
                </button>
            </form>
        </div>
    </section>

    <!-- end subscribe section -->

    <!-- client section -->
    <section class="client_section layout_margin">
        <div class="container">
            <div class="heading_container">
                <h2>
                    Check what people say About us!
                </h2>
            </div>
            <div class="client_container layout_padding2-top">
                <div class="client-id">
                    <div class="img-box">
                        <img src="{{ env('APP_URL') }}/vendor/uxos/images/client.png" alt="" />
                    </div>
                    <div class="name">
                        <img src="{{ env('APP_URL') }}/vendor/uxos/images/quote.png" alt="" />
                        <h6>
                            Sandy Delex
                        </h6>
                        <p>
                            Reprehenderit
                        </p>
                    </div>
                </div>
                <div class="client-detail">
                    <p>
                        dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                        incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                        veniam, quis nostrud esse cillum
                    </p>
                </div>
                <div class="d-flex justify-content-end">
                    <a href="">
                        Read More
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- end client section -->

    <!-- contact section -->
    <section class="contact_section layout_padding">
        <div class="container">
            <div class="d-flex ">
                <h2>
                    Contact Us
                </h2>
            </div>
            <div class="row">
                <div class="col-md-6">

                    <form action="">
                        <div class="contact_form-container">
                            <div>
                                <div>
                                    <input type="text" placeholder="Name">
                                </div>
                                <div>
                                    <input type="text" placeholder="Phone Number">
                                </div>
                                <div>
                                    <input type="email" placeholder="Email">
                                </div>
                                <div class="mt-5">
                                    <input type="text" placeholder="Message">
                                </div>
                                <div class="mt-5">
                                    <button type="submit">
                                        send
                                    </button>
                                </div>
                            </div>

                        </div>

                    </form>
                </div>
                <div class="col-md-6">
                    <div class="contact_img-box">
                        <img src="{{ env('APP_URL') }}/vendor/uxos/images/contact-img.png" alt="">
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- end contact section -->
    <!-- info section -->
    <section class="info_section layout_padding-top">
        <div class="info_logo-box">
            <h2>
                UXOS
            </h2>
        </div>
        <div class="container layout_padding2">
            <div class="row">
                <div class="col-md-3">
                    <h5>
                        About Us
                    </h5>
                    <p>
                        dolor sit amet, consectetur magna aliqua. Ut enim ad minim veniam, quisdotempor incididunt r
                    </p>
                </div>
                <div class="col-md-3">
                    <h5>
                        Useful Link
                    </h5>
                    <ul>
                        <li>
                            <a href="">
                                Video games
                            </a>
                        </li>
                        <li>
                            <a href="">
                                Remote control
                            </a>
                        </li>
                        <li>
                            <a href="">
                                3d controller
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="col-md-3">
                    <h5>
                        Contact Us
                    </h5>
                    <p>
                        dolor sit amet, consectetur magna aliqua. quisdotempor incididunt ut e
                    </p>
                </div>
                <div class="col-md-3">

                    <div class="subscribe_container">
                        <h5>
                            Newsletter
                        </h5>
                        <div class="form_container">
                            <form action="">
                                <input type="email" placeholder="Enter your email">
                                <button type="submit">
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div class="container">
            <div class="social_container">

                <div class="social-box">
                    <a href="">
                        <img src="{{ env('APP_URL') }}/vendor/uxos/images/fb.png" alt="">
                    </a>

                    <a href="">
                        <img src="{{ env('APP_URL') }}/vendor/uxos/images/twitter.png" alt="">
                    </a>
                    <a href="">
                        <img src="{{ env('APP_URL') }}/vendor/uxos/images/linkedin.png" alt="">
                    </a>
                    <a href="">
                        <img src="{{ env('APP_URL') }}/vendor/uxos/images/instagram.png" alt="">
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- end info section -->
@endsection
