@extends('layout.bootstrap.master')
@section('content')
    <style>
        .bxcd {
            padding: 1rem !important
        }

    </style>

    <div class="container px-4 py-5 bxcd" id="featured-3">
        <h2 class="pb-2 border-bottom">BÁNH XE CUỘC ĐỜI</h2>
        <div class="row g-4 py-5 row-cols-1 row-cols-lg-3 bxcd">
            <div class="form-horizontal" role="form">
                <div class="form-group">
                    <div class="col-md-12">
                        <input type="text" class="form-control" id="txt0" value="Sức khỏe">
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-md-12">
                        <div class="form-group row">

                            <div class="col-md-6">
                                <span class="col-md-2 control-label">Hiện trạng</span>
                                <input type="number" min="0" max="10" class="form-control" id="old0" value="5">
                            </div>
                            <div class="col-md-6">
                                <span class="col-md-2 control-label">Mong muốn</span>
                                <input type="number" min="0" max="10" class="form-control" id="new0" value="5">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-horizontal" role="form">
                <div class="form-group">
                    <div class="col-md-12">
                        <input type="text" class="form-control" id="txt1" value="Phát triển bản thân">
                    </div>
                </div>
                <div class="form-group">

                    <div class="col-md-12">
                        <div class="form-group row">
                            <div class="col-md-6">
                                <span class="col-md-2 control-label">Hiện trạng</span>
                                <input type="number" min="0" max="10" class="form-control" id="old1" value="5">
                            </div>
                            <div class="col-md-6">
                                <span class="col-md-2 control-label">Mong muốn</span>
                                <input type="number" min="0" max="10" class="form-control" id="new1" value="5">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-horizontal" role="form">
                <div class="form-group">
                    <div class="col-md-12">
                        <input type="text" class="form-control" id="txt2" value="Mối quan hệ">
                    </div>
                </div>
                <div class="form-group">

                    <div class="col-md-12">
                        <div class="form-group row">
                            <div class="col-md-6">
                                <span class="col-md-2 control-label">Hiện trạng</span>
                                <input type="number" min="0" max="10" class="form-control" id="old2" value="5">
                            </div>
                            <div class="col-md-6">
                                <span class="col-md-2 control-label">Mong muốn</span>
                                <input type="number" min="0" max="10" class="form-control" id="new2" value="5">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-horizontal" role="form">
                <div class="form-group">
                    <div class="col-md-12">
                        <input type="text" class="form-control" id="txt3" value="Tài chính">
                    </div>
                </div>
                <div class="form-group">

                    <div class="col-md-12">
                        <div class="form-group row">
                            <div class="col-md-6">
                                <span class="col-md-2 control-label">Hiện trạng</span>
                                <input type="number" min="0" max="10" class="form-control" id="old3" value="5">
                            </div>
                            <div class="col-md-6">
                                <span class="col-md-2 control-label">Mong muốn</span>
                                <input type="number" min="0" max="10" class="form-control" id="new3" value="5">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-horizontal" role="form">
                <div class="form-group">
                    <div class="col-md-12">
                        <input type="text" class="form-control" id="txt4" value="Sự nghiệp">
                    </div>
                </div>
                <div class="form-group">

                    <div class="col-md-12">
                        <div class="form-group row">
                            <div class="col-md-6">
                                <span class="col-md-2 control-label">Hiện trạng</span>
                                <input type="number" min="0" max="10" class="form-control" id="old4" value="5">
                            </div>
                            <div class="col-md-6">
                                <span class="col-md-2 control-label">Mong muốn</span>
                                <input type="number" min="0" max="10" class="form-control" id="new4" value="5">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-horizontal" role="form">
                <div class="form-group">
                    <div class="col-md-12">
                        <input type="text" class="form-control" id="txt5" value="Giải trí">
                    </div>
                </div>
                <div class="form-group">

                    <div class="col-md-12">
                        <div class="form-group row">
                            <div class="col-md-6">
                                <span class="col-md-2 control-label">Hiện trạng</span>
                                <input type="number" min="0" max="10" class="form-control" id="old5" value="5">
                            </div>
                            <div class="col-md-6">
                                <span class="col-md-2 control-label">Mong muốn</span>
                                <input type="number" min="0" max="10" class="form-control" id="new5" value="5">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-horizontal" role="form">
                <div class="form-group">
                    <div class="col-md-12">
                        <input type="text" class="form-control" id="txt6" value="Chia sẻ">
                    </div>
                </div>
                <div class="form-group">

                    <div class="col-md-12">
                        <div class="form-group row">
                            <div class="col-md-6">
                                <span class="col-md-2 control-label">Hiện trạng</span>
                                <input type="number" min="0" max="10" class="form-control" id="old6" value="5">
                            </div>
                            <div class="col-md-6">
                                <span class="col-md-2 control-label">Mong muốn</span>
                                <input type="number" min="0" max="10" class="form-control" id="new6" value="5">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-horizontal" role="form">
                <div class="form-group">
                    <div class="col-md-12">
                        <input type="text" class="form-control" id="txt7" value="Tâm linh">
                    </div>
                </div>
                <div class="form-group">

                    <div class="col-md-12">
                        <div class="form-group row">
                            <div class="col-md-6">
                                <span class="col-md-2 control-label">Hiện trạng</span>
                                <input type="number" min="0" max="10" class="form-control" id="old7" value="5">
                            </div>
                            <div class="col-md-6">
                                <span class="col-md-2 control-label">Mong muốn</span>
                                <input type="number" min="0" max="10" class="form-control" id="new7" value="5">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button id="push" class="btn btn-outline-primary">Cập nhật</button>
        </div>
    </div>
    <div class="container">
        <div class="row justify-content-md-center">
            <div class="col col-lg-8">
                <canvas id="myChart" width="400" height="400"></canvas>
            </div>
        </div>
    </div>

@endsection
