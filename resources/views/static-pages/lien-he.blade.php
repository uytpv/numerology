<?php
use App\Models\IndicatorNumber;
use App\Models\Indicator;
?>
@extends('layout.master')

@section('content')
    <section class="visual">
        <h2>Liên hệ</h2>
        <div class="container area trans80">
            <div class="visual-list">
                <div class="text-holder pdlr10percent">
                    <h3>Thông tin liên hệ</h3>
                    <div class="row justify-content-center aos-init aos-animate" data-aos="fade-up">
                        <div class="col-lg-10">
                            <div class="info-wrap">
                                <div class="row">
                                    <div class="col-lg-4 info">
                                        <h4><i class="fa fa-map-marker"></i> Dịa Chỉ:</h4>
                                        <p>124 Xô Viết Nghệ Tĩnh<br>Phường 21, Quận Bình Thạnh, TPHCM</p>
                                    </div>
                                    <div class="col-lg-4 info mt-4 mt-lg-0">
                                        <h4><i class="fa fa-envelope-o"></i> Email:</h4>
                                        <p>lengochue@gmail.com<br>pigbanguy@gmail.com</p>
                                    </div>
                                    <div class="col-lg-4 info mt-4 mt-lg-0">
                                        
                                        <h4><i class="fa fa-mobile"></i> Call:</h4>
                                        <p>+84 932 062 322</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
@endsection
