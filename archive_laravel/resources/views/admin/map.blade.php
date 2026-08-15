<?php
use App\Models\IndicatorNumber;
use App\Models\Indicator;
// dd($cus);
// dd(json_decode($cus->lesson));
?>

<style>
    .ext-icon {
        color: rgba(0, 0, 0, 0.5);
        margin-left: 10px;
    }

    .installed {
        color: #00a65a;
        margin-right: 10px;
    }

    .box-noboder {
        padding-top: 20px;
        border: none;
    }

    .box {
        margin-bottom: 0;
    }

    .number {
        font-size: 40px;
        color: #00a65a;
        cursor: pointer;
    }

    .indicator-name {
        font-size: 14px;
    }

    .box-header {
        padding: 3px;
    }

    .row {
        padding-bottom: 5px;
    }

    .text-center {
        margin-bottom: 2px;
    }

    .buildingBlock {
        display: inline-block;
        width: 60px;
        height: 60px;
        margin: 2px 5px;
        background-color: #eee;
        border: 2px solid #ccc;
    }

    #container {
        text-align: center;
    }
</style>
<div class="box box-default box-noboder">
    <div class="box-body">
        <div class="row">
            <div class="col col-lg-4 col-md-4 col-xs-4">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">Đường Đời</h4>
                        <p class="text-center">
                            <a indicator="life_path" number="{{ $cus->life_path }}" data-toggle="modal"
                                data-target="#QuickInfo" class="number showQuickInfo"
                                @if (json_decode($cus->lesson)->life_path) style="color: red" @endif>{{ $cus->life_path }}</a>
                        </p>
                        {{-- <small>{{ Indicator::where(['code'=> $map[0]->indicator])->first()->short_description }}</small> --}}
                    </div>
                </div>
            </div>
            <div class="col col-lg-4 col-md-4 col-xs-4">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">Sứ Mệnh</h4>
                        <p class="text-center">
                            <a indicator="expression" number="{{ $cus->expression }}" data-toggle="modal"
                                data-target="#QuickInfo" class="number showQuickInfo"
                                @if (json_decode($cus->lesson)->expression) style="color: red" @endif>{{ $cus->expression }}</a>
                        </p>
                        {{-- <small>{{ Indicator::where(['code'=> $map[1]->indicator])->first()->short_description }}</small> --}}
                    </div>
                </div>
            </div>
            <div class="col col-lg-4 col-md-4 col-xs-4">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">KN Đường Đời - Sứ Mệnh</h4>
                        <p class="text-center">
                            <a indicator="lpe_bridge" number="{{ $cus->lpe_bridge }}" data-toggle="modal"
                                data-target="#QuickInfo" class="number showQuickInfo">{{ $cus->lpe_bridge }}</a>
                        </p>
                        {{-- <small>{{ Indicator::where(['code'=> $map[2]->indicator])->first()->short_description }}</small> --}}
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col col-lg-4 col-md-4 col-xs-4">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">Linh Hồn</h4>
                        <p class="text-center">
                            <a indicator="heart_desire" number="{{ $cus->heart_desire }}" data-toggle="modal"
                                data-target="#QuickInfo" class="number showQuickInfo"
                                @if (json_decode($cus->lesson)->heart_desire) style="color: red" @endif>{{ $cus->heart_desire }}</a>
                        </p>
                        {{-- <small>{{ Indicator::where(['code'=> $map[3]->indicator])->first()->short_description }}</small> --}}
                    </div>
                </div>
            </div>
            <div class="col col-lg-4 col-md-4 col-xs-4">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">Nhân Cách</h4>
                        <p class="text-center"><a indicator="personality" number="{{ $cus->personality }}"
                                data-toggle="modal" data-target="#QuickInfo" class="number showQuickInfo"
                                @if (json_decode($cus->lesson)->personality) style="color: red" @endif>{{ $cus->personality }}</a>
                        </p>
                        {{-- <small>{{ Indicator::where(['code'=> $map[4]->indicator])->first()->short_description }}</small> --}}
                    </div>
                </div>
            </div>
            <div class="col col-lg-4 col-md-4 col-xs-4">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">KN Linh Hồn - Nhân Cách</h4>
                        <p class="text-center">
                            <a indicator="hdp_bridge" number="{{ $cus->hdp_bridge }}" data-toggle="modal"
                                data-target="#QuickInfo" class="number showQuickInfo">{{ $cus->hdp_bridge }}</a>
                        </p>
                        {{-- <small>{{ Indicator::where(['code'=> $map[5]->indicator])->first()->short_description }}</small> --}}
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col col-lg-4 col-md-4 col-xs-4">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">Ngày Sinh</h4>
                        <p class="text-center"><a indicator="birthday" number="{{ $cus->birthday }}"
                                data-toggle="modal" data-target="#QuickInfo" class="number showQuickInfo"
                                @if (json_decode($cus->lesson)->birthday) style="color: red" @endif>{{ $cus->birthday }}</a>
                        </p>
                        {{-- <small>{{ Indicator::where(['code'=> $map[7]->indicator])->first()->short_description }}</small> --}}
                    </div>
                </div>
            </div>
            <div class="col col-lg-4 col-md-4 col-xs-4">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">Trưởng Thành</h4>
                        <p class="text-center"><a indicator="maturity" number="{{ $cus->maturity }}"
                                data-toggle="modal" data-target="#QuickInfo" class="number showQuickInfo"
                                @if (json_decode($cus->lesson)->maturity) style="color: red" @endif>{{ $cus->maturity }}</a>
                        </p>
                        {{-- <small>{{ Indicator::where(['code'=> $map[8]->indicator])->first()->short_description }}</small> --}}
                    </div>
                </div>
            </div>
            <div class="col col-lg-4 col-md-4 col-xs-4">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">Cân Bằng</h4>
                        <p class="text-center">
                            <a indicator="balance" number="{{ $cus->balance }}" data-toggle="modal"
                                data-target="#QuickInfo" class="number showQuickInfo">{{ $cus->balance }}</a>
                        </p>
                        {{-- <small>{{ Indicator::where(['code'=> $map[6]->indicator])->first()->short_description }}</small> --}}
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col col-lg-4 col-md-4 col-xs-4">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">Tư Duy Lý Trí</h4>
                        <p class="text-center"><a indicator="rational_thought" number="{{ $cus->rational_thought }}"
                                data-toggle="modal" data-target="#QuickInfo"
                                class="number showQuickInfo">{{ $cus->rational_thought }}</a></p>
                        {{-- <small>{{ Indicator::where(['code'=> $map[10]->indicator])->first()->short_description }}</small> --}}
                    </div>
                </div>
            </div>
            <div class="col col-lg-4 col-md-4 col-xs-4">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">Sức Mạnh Tiềm Thức</h4>
                        <p class="text-center"><a indicator="subconscious_confidence"
                                number="{{ $cus->subconscious_confidence }}" data-toggle="modal"
                                data-target="#QuickInfo"
                                class="number showQuickInfo">{{ $cus->subconscious_confidence }}</a></p>
                        {{-- <small>{{ Indicator::where(['code'=> $map[11]->indicator])->first()->short_description }}</small> --}}
                    </div>
                </div>
            </div>
            <div class="col col-lg-4 col-md-4 col-xs-4">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">Đam Mê Tiềm Ẩn</h4>
                        <p class="text-center">
                            @foreach (json_decode($cus->hidden_passion) as $index => $number)
                                <a indicator="hidden_passion" number="{{ $number }}" data-toggle="modal"
                                    data-target="#QuickInfo"
                                    class="number showQuickInfo">{{ $number }}{{ $index + 1 < sizeof(json_decode($cus->hidden_passion)) ? ',' : '' }}</a>
                            @endforeach
                        </p>
                        {{-- <small>{{ Indicator::where(['code'=> $map[12]->indicator])->first()->short_description }}</small> --}}
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col col-lg-4 col-md-4 col-xs-4">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">Chỉ Số Thiếu</h4>
                        <p class="text-center">
                            @foreach (json_decode($cus->karmic_lessons) as $index => $number)
                                <a indicator="karmic_lessons" number="{{ $number }}" data-toggle="modal"
                                    data-target="#QuickInfo"
                                    class="number showQuickInfo">{{ $number }}{{ $index + 1 < sizeof(json_decode($cus->karmic_lessons)) ? ',' : '' }}</a>
                            @endforeach
                        </p>
                        {{-- <small>{{ Indicator::where(['code'=> $map[9]->indicator])->first()->short_description }}</small> --}}
                    </div>
                </div>
            </div>
            <div class="col col-lg-4 col-md-4 col-xs-4">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">Thái Độ</h4>
                        <p class="text-center"><a indicator="attitude" number="{{ $cus->attitude }}"
                                data-toggle="modal" data-target="#QuickInfo"
                                class="number showQuickInfo">{{ $cus->attitude }}</a></p>
                    </div>
                </div>
            </div>
            <div class="col col-lg-4 col-md-4 col-xs-4">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">Thế Hệ</h4>
                        <p class="text-center"><a indicator="generation" number="{{ $cus->generation }}"
                                data-toggle="modal" data-target="#QuickInfo"
                                class="number showQuickInfo">{{ $cus->generation }}</a></p>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div id="container">
                {{-- {{ dd($map[16]) }} --}}
                <h4 class="text-center indicator-name">Sơ Đồ Chặng | Thách Thức | 4 Đỉnh Cao Cuộc Đời
                    <strong>({{ \Carbon\Carbon::now()->format('Y') - \Carbon\Carbon::createFromFormat('d/m/Y', $cus->dob)->format('Y') }}
                        tuổi)</strong>
                </h4>
                <div class="buildingBlock">
                    <a indicator="pinnacle" number="{{ json_decode($cus->pinnacle)[3] }}" data-toggle="modal"
                        data-target="#QuickInfo"
                        class="number showQuickInfo">{{ json_decode($cus->pinnacle)[3] }}</a>
                    <sub>{{ json_decode($cus->age)[3] }}</sub>
                </div>
                <div></div>
                <div class="buildingBlock">
                    <a indicator="pinnacle" number="{{ json_decode($cus->pinnacle)[2] }}" data-toggle="modal"
                        data-target="#QuickInfo"
                        class="number showQuickInfo">{{ json_decode($cus->pinnacle)[2] }}</a>
                    <sub>{{ json_decode($cus->age)[2] }}</sub>
                </div>
                <div></div>
                <div class="buildingBlock">
                    <a indicator="pinnacle" number="{{ json_decode($cus->pinnacle)[0] }}" data-toggle="modal"
                        data-target="#QuickInfo"
                        class="number showQuickInfo">{{ json_decode($cus->pinnacle)[0] }}</a>
                    <sub>{{ json_decode($cus->age)[0] }}</sub>
                </div>
                <div class="buildingBlock">
                    <a indicator="pinnacle" number="{{ json_decode($cus->pinnacle)[1] }}" data-toggle="modal"
                        data-target="#QuickInfo"
                        class="number showQuickInfo">{{ json_decode($cus->pinnacle)[1] }}</a>
                    <sub>{{ json_decode($cus->age)[1] }}</sub>
                </div>
                <div></div>
                <div class="buildingBlock">
                    <a indicator="root" number="{{ json_decode($cus->root)[0] }}" data-toggle="modal"
                        data-target="#QuickInfo" class="number showQuickInfo">{{ json_decode($cus->root)[0] }}</a>
                </div>
                <div class="buildingBlock">
                    <a indicator="root" number="{{ json_decode($cus->root)[1] }}" data-toggle="modal"
                        data-target="#QuickInfo" class="number showQuickInfo">{{ json_decode($cus->root)[1] }}</a>
                </div>
                <div class="buildingBlock">
                    <a indicator="root" number="{{ json_decode($cus->root)[2] }}" data-toggle="modal"
                        data-target="#QuickInfo" class="number showQuickInfo">{{ json_decode($cus->root)[2] }}</a>
                </div>
                <div></div>
                <div class="buildingBlock">
                    <a indicator="challennge" number="{{ json_decode($cus->challennge)[0] }}" data-toggle="modal"
                        data-target="#QuickInfo"
                        class="number showQuickInfo">{{ json_decode($cus->challennge)[0] }}</a>
                </div>
                <div class="buildingBlock">
                    <a indicator="challennge" number="{{ json_decode($cus->challennge)[1] }}" data-toggle="modal"
                        data-target="#QuickInfo"
                        class="number showQuickInfo">{{ json_decode($cus->challennge)[1] }}</a>
                </div>
                <div></div>
                <div class="buildingBlock">
                    <a indicator="challennge" number="{{ json_decode($cus->challennge)[2] }}" data-toggle="modal"
                        data-target="#QuickInfo"
                        class="number showQuickInfo">{{ json_decode($cus->challennge)[2] }}</a>
                </div>
                <div></div>
                <div class="buildingBlock">
                    <a indicator="challennge" number="{{ json_decode($cus->challennge)[3] }}" data-toggle="modal"
                        data-target="#QuickInfo"
                        class="number showQuickInfo">{{ json_decode($cus->challennge)[3] }}</a>
                </div>
                <div></div>
            </div>
            {{-- <div class="col col-lg-6 col-md-6 col-xs-6">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">{{ Indicator::where(['code' => $map[13]->indicator])->first()->name }}</h4>
                    </div>
                </div>
                <div class="box-body text-center">
                    <p class="number">
                        @foreach ($map[13]->number as $index => $number)
                        <a indicator="{{ $map[13]->indicator }}"
                            number="{{ $number }}"
                            data-toggle="modal" data-target="#QuickInfo"
                            class="number showQuickInfo">{{ $number }}{{ (($index + 1) < sizeof($map[13]->number)) ? ',' : '' }}</a>
                        @endforeach
                    </p>
                    <small>{{ Indicator::where(['code'=> $map[13]->indicator])->first()->short_description ?? '' }}</small>
                </div>
            </div> --}}
            {{-- <div class="col col-lg-6 col-md-6 col-xs-6">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">{{ Indicator::where(['code' => $map[14]->indicator])->first()->name }}</h4>
                    </div>
                </div>
                <div class="box-body text-center">
                    <p class="number">
                        @foreach ($map[14]->number as $index => $number)
                        <a indicator="{{ $map[14]->indicator }}"
                            number="{{ $number }}"
                            data-toggle="modal" data-target="#QuickInfo"
                            class="number showQuickInfo">{{ $number }}{{ (($index + 1) < sizeof($map[14]->number)) ? ',' : '' }}</a>
                        @endforeach
                    </p>
                    <small>{{ Indicator::where(['code'=> $map[14]->indicator])->first()->short_description }}</small>
                </div>
            </div> --}}
        </div>
    </div>
</div>



<!-- MODAL -->
<div class="modal grid-modal fade in" id="QuickInfo" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content" style="border-radius: 5px;">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal"
                    aria-label="Close"><span>×</span></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div id="short-description" class="col col-lg-12">

                    </div>
                    <div id="description" class="col col-lg-12">

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
    $(document).ready(function() {
        $('.showQuickInfo').click(function() {
            $('#QuickInfo').toggleClass('is-active'); // MODAL

            var $indicator = this.getAttribute('indicator');
            var $number = this.getAttribute('number');
            getEntryData($indicator, $number);
        });
    });

    $('#QuickInfo').on('hidden.bs.modal', function() {
        $('#short-description').empty();
        $('#description').empty();
    });

    function getEntryData(indicator, number) {
        $.ajax({
            url: '{{ env('APP_URL') }}/admin/showDetail/' + indicator + '/' + number,
            type: 'get',
            dataType: 'json',
            success: function(response) {
                if (response.length == 0) {
                    console.log("Không tìm thấy dữ liệu.");
                } else {
                    // set values
                    // $('#short-description').append( response.short_description );
                    $('#description').append(response.description);
                    // and so on
                }
            }
        });
    }

    // document.getElementById("year").innerHTML = new Date().getFullYear() - 1;
</script>
