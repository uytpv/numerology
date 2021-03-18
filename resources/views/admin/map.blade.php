<?php
    use  App\Models\IndicatorNumber;
    use  App\Models\Indicator;
?>

<style>
    .ext-icon {
        color: rgba(0,0,0,0.5);
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
    .box{
        margin-bottom : 0;
    }
    .number {
        font-size: 40px;
        color: #00a65a;
        cursor: pointer;
    }
    .indicator-name {
        font-size: 14px;
    }
    .box-header{
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
                        <h4 class="text-center indicator-name">{{ Indicator::where(['code' => $map[0]->indicator])->first()->name }}</h4>
                        <p class="text-center">
                            <a indicator="{{ $map[0]->indicator }}"
                            number="{{ $map[0]->number }}"
                            data-toggle="modal" data-target="#QuickInfo"
                            class="number showQuickInfo">{{ $map[0]->number }}</a>
                            </p>
                        {{-- <small>{{ Indicator::where(['code'=> $map[0]->indicator])->first()->short_description }}</small> --}}
                    </div>
                </div>
            </div>
            <div class="col col-lg-4 col-md-4 col-xs-4">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">
                            {{ Indicator::where(['code' => $map[1]->indicator])->first()->name }}
                        </h4>
                        <p class="text-center">
                            <a indicator="{{ $map[1]->indicator }}"
                                number="{{ $map[1]->number }}"
                                data-toggle="modal" data-target="#QuickInfo"
                                class="number showQuickInfo">{{ $map[1]->number }}</a>
                            </p>
                        {{-- <small>{{ Indicator::where(['code'=> $map[1]->indicator])->first()->short_description }}</small> --}}
                    </div>
                </div>
            </div>
            <div class="col col-lg-4 col-md-4 col-xs-4">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">
                            {{ Indicator::where(['code' => $map[2]->indicator])->first()->name }}

                        </h4>
                        <p class="text-center"><a indicator="{{ $map[2]->indicator }}"
                            number="{{ $map[2]->number }}"
                            data-toggle="modal" data-target="#QuickInfo"
                            class="number showQuickInfo">{{ $map[2]->number }}</a></p>
                        {{-- <small>{{ Indicator::where(['code'=> $map[2]->indicator])->first()->short_description }}</small> --}}
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col col-lg-4 col-md-4 col-xs-4">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">
                            {{ Indicator::where(['code' => $map[3]->indicator])->first()->name }}
                        </h4>
                        <p class="text-center"><a indicator="{{ $map[3]->indicator }}"
                            number="{{ $map[3]->number }}"
                            data-toggle="modal" data-target="#QuickInfo"
                            class="number showQuickInfo">{{ $map[3]->number }}</a></p>
                        {{-- <small>{{ Indicator::where(['code'=> $map[3]->indicator])->first()->short_description }}</small> --}}
                    </div>
                </div>
            </div>
            <div class="col col-lg-4 col-md-4 col-xs-4">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">
                                {{ Indicator::where(['code' => $map[4]->indicator])->first()->name }}

                        </h4>
                        <p class="text-center"><a indicator="{{ $map[4]->indicator }}"
                            number="{{ $map[4]->number }}"
                            data-toggle="modal" data-target="#QuickInfo"
                            class="number showQuickInfo">{{ $map[4]->number }}</a></p>
                        {{-- <small>{{ Indicator::where(['code'=> $map[4]->indicator])->first()->short_description }}</small> --}}
                    </div>
                </div>
            </div>
            <div class="col col-lg-4 col-md-4 col-xs-4">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">
                            {{ Indicator::where(['code' => $map[5]->indicator])->first()->name }}

                        </h4>
                        <p class="text-center"><a indicator="{{ $map[5]->indicator }}"
                            number="{{ $map[5]->number }}"
                            data-toggle="modal" data-target="#QuickInfo"
                            class="number showQuickInfo">{{ $map[5]->number }}</a></p>
                        {{-- <small>{{ Indicator::where(['code'=> $map[5]->indicator])->first()->short_description }}</small> --}}
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col col-lg-4 col-md-4 col-xs-4">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">
                            {{ Indicator::where(['code' => $map[6]->indicator])->first()->name }}

                        </h4>
                        <p class="text-center"><a indicator="{{ $map[6]->indicator }}"
                            number="{{ $map[6]->number }}"
                            data-toggle="modal" data-target="#QuickInfo"
                            class="number showQuickInfo">{{ $map[6]->number }}</a></p>
                        {{-- <small>{{ Indicator::where(['code'=> $map[6]->indicator])->first()->short_description }}</small> --}}
                    </div>
                </div>
            </div>
            <div class="col col-lg-4 col-md-4 col-xs-4">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">
                            {{ Indicator::where(['code' => $map[7]->indicator])->first()->name }}

                        </h4>
                        <p class="text-center"><a indicator="{{ $map[7]->indicator }}"
                            number="{{ $map[7]->number }}"
                            data-toggle="modal" data-target="#QuickInfo"
                            class="number showQuickInfo">{{ $map[7]->number }}</a></p>
                        {{-- <small>{{ Indicator::where(['code'=> $map[7]->indicator])->first()->short_description }}</small> --}}
                    </div>
                </div>
            </div>
            <div class="col col-lg-4 col-md-4 col-xs-4">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">
                            {{ Indicator::where(['code' => $map[8]->indicator])->first()->name }}

                        </h4>
                        <p class="text-center"><a indicator="{{ $map[8]->indicator }}"
                            number="{{ $map[8]->number }}"
                            data-toggle="modal" data-target="#QuickInfo"
                            class="number showQuickInfo">{{ $map[8]->number }}</a></p>
                        {{-- <small>{{ Indicator::where(['code'=> $map[8]->indicator])->first()->short_description }}</small> --}}
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col col-lg-6 col-md-6 col-xs-6">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">
                            {{ Indicator::where(['code' => $map[10]->indicator])->first()->name }}

                        </h4>
                        <p class="text-center"><a indicator="{{ $map[10]->indicator }}"
                            number="{{ $map[10]->number }}"
                            data-toggle="modal" data-target="#QuickInfo"
                            class="number showQuickInfo">{{ $map[10]->number }}</a></p>
                        {{-- <small>{{ Indicator::where(['code'=> $map[10]->indicator])->first()->short_description }}</small> --}}
                    </div>
                </div>
            </div>
            <div class="col col-lg-6 col-md-6 col-xs-6">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">
                            {{ Indicator::where(['code' => $map[11]->indicator])->first()->name }}

                        </h4>
                        <p class="text-center"><a indicator="{{ $map[11]->indicator }}"
                            number="{{ $map[11]->number }}"
                            data-toggle="modal" data-target="#QuickInfo"
                            class="number showQuickInfo">{{ $map[11]->number }}</a></p>
                        {{-- <small>{{ Indicator::where(['code'=> $map[11]->indicator])->first()->short_description }}</small> --}}
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col col-lg-6 col-md-6 col-xs-6">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">
                            {{ Indicator::where(['code' => $map[12]->indicator])->first()->name }}
                        </h4>
                        <p class="text-center">
                            @foreach ($map[12]->number as $index => $number)
                            <a indicator="{{ $map[12]->indicator }}"
                                number="{{ $number }}"
                                data-toggle="modal" data-target="#QuickInfo"
                                class="number showQuickInfo">{{ $number }}{{ (($index + 1) < sizeof($map[12]->number)) ? ',' : '' }}</a>
                            @endforeach
                        </p>
                        {{-- <small>{{ Indicator::where(['code'=> $map[12]->indicator])->first()->short_description }}</small> --}}
                    </div>
                </div>
            </div>
            <div class="col col-lg-6 col-md-6 col-xs-6">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">
                            {{ Indicator::where(['code' => $map[9]->indicator])->first()->name }}
                        </h4>
                        <p class="text-center">
                            @foreach ($map[9]->number as $index => $number)
                            <a indicator="{{ $map[9]->indicator }}"
                                number="{{ $number }}"
                                data-toggle="modal" data-target="#QuickInfo"
                                class="number showQuickInfo">{{ $number }}{{ (($index + 1) < sizeof($map[9]->number)) ? ',' : '' }}</a>
                            @endforeach
                        </p>
                        {{-- <small>{{ Indicator::where(['code'=> $map[9]->indicator])->first()->short_description }}</small> --}}
                    </div>
                </div>
            </div>

        </div>
        <div class="row">
            <div id="container">
                {{-- {{ dd($map[16]) }} --}}
                <h4 class="text-center indicator-name">Sơ Đồ Chặng | Thách Thức | 4 Đỉnh Cao Cuộc Đời</h4>
                <div class="buildingBlock">
                    <a indicator="{{ $map[14]->indicator }}"
                        number="{{ $map[14]->number[3] }}"
                        data-toggle="modal" data-target="#QuickInfo"
                        class="number showQuickInfo">{{ $map[14]->number[3] }}</a>
                    <sub>{{$map[15]->number[3]}}</sub></div>
                <div></div>
                <div class="buildingBlock">
                    <a indicator="{{ $map[14]->indicator }}"
                        number="{{ $map[14]->number[2] }}"
                        data-toggle="modal" data-target="#QuickInfo"
                        class="number showQuickInfo">{{ $map[14]->number[2] }}</a>
                    <sub>{{$map[15]->number[2]}}</sub></div>
                <div></div>
                <div class="buildingBlock">
                    <a indicator="{{ $map[14]->indicator }}"
                        number="{{ $map[14]->number[0] }}"
                        data-toggle="modal" data-target="#QuickInfo"
                        class="number showQuickInfo">{{ $map[14]->number[0] }}</a>
                    <sub>{{$map[15]->number[0]}}</sub></div>
                <div class="buildingBlock">
                    <a indicator="{{ $map[14]->indicator }}"
                        number="{{ $map[14]->number[1] }}"
                        data-toggle="modal" data-target="#QuickInfo"
                        class="number showQuickInfo">{{ $map[14]->number[1] }}</a>
                    <sub>{{$map[15]->number[1]}}</sub></div>
                <div></div>
                <div class="buildingBlock">
                    <a indicator="{{ $map[16]->indicator }}"
                        number="{{ $map[16]->number[0] }}"
                        data-toggle="modal" data-target="#QuickInfo"
                        class="number showQuickInfo">{{ $map[16]->number[0] }}</a>
                </div>
                <div class="buildingBlock">
                    <a indicator="{{ $map[16]->indicator }}"
                        number="{{ $map[16]->number[1] }}"
                        data-toggle="modal" data-target="#QuickInfo"
                        class="number showQuickInfo">{{ $map[16]->number[1] }}</a>
                </div>
                <div class="buildingBlock">
                    <a indicator="{{ $map[16]->indicator }}"
                        number="{{ $map[16]->number[2] }}"
                        data-toggle="modal" data-target="#QuickInfo"
                        class="number showQuickInfo">{{ $map[16]->number[2] }}</a>
                </div>
                <div></div>
                <div class="buildingBlock">
                    <a indicator="{{ $map[13]->indicator }}"
                        number="{{ $map[13]->number[0] }}"
                        data-toggle="modal" data-target="#QuickInfo"
                        class="number showQuickInfo">{{ $map[13]->number[0] }}</a>
                </div>
                <div class="buildingBlock">
                    <a indicator="{{ $map[13]->indicator }}"
                        number="{{ $map[13]->number[1] }}"
                        data-toggle="modal" data-target="#QuickInfo"
                        class="number showQuickInfo">{{ $map[13]->number[1] }}</a>
                </div>
                <div></div>
                <div class="buildingBlock">
                    <a indicator="{{ $map[13]->indicator }}"
                        number="{{ $map[13]->number[2] }}"
                        data-toggle="modal" data-target="#QuickInfo"
                        class="number showQuickInfo">{{ $map[13]->number[2] }}</a>
                </div>
                <div></div>
                <div class="buildingBlock">
                    <a indicator="{{ $map[13]->indicator }}"
                        number="{{ $map[13]->number[3] }}"
                        data-toggle="modal" data-target="#QuickInfo"
                        class="number showQuickInfo">{{ $map[13]->number[3] }}</a>
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
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span>×</span></button>
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
    $(document).ready(function () {
        $('.showQuickInfo').click(function () {
            $('#QuickInfo').toggleClass('is-active'); // MODAL

            var $indicator = this.getAttribute('indicator');
            var $number = this.getAttribute('number');
            getEntryData($indicator, $number);
        });
    });

    $('#QuickInfo').on('hidden.bs.modal', function () {
        $('#short-description').empty();
        $('#description').empty();
    });

    function getEntryData(indicator, number) {
        $.ajax({
            url: '{{ env('APP_URL') }}/admin/showDetail/' + indicator + '/' + number,
            type: 'get',
            dataType: 'json',
            success: function (response) {
                if (response.length == 0) {
                    console.log( "Không tìm thấy dữ liệu.");
                } else {
                    // set values
                    // $('#short-description').append( response.short_description );
                    $('#description').append( response.description );
                    // and so on
                }
            }
        });
    }

    // document.getElementById("year").innerHTML = new Date().getFullYear() - 1;
</script>
