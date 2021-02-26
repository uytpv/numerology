<?php
    use  App\Models\IndicatorNumber;
    use  App\Models\Indicator;
?>

<div class="box-body">
    <div class="row">
        <div class="col col-lg-12">
            <div class="box box-primary">
                <div class="box-header">
                    <h4 class="text-center">Chỉ Số {{ Indicator::where(['code' => $map[17]->indicator])->first()->name }}</h4>
                </div>
            </div>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Năm <span id="year"></span></th>
                        <th scope="col">T1</th>
                        <th scope="col">T2</th>
                        <th scope="col">T3</th>
                        <th scope="col">T4</th>
                        <th scope="col">T5</th>
                        <th scope="col">T6</th>
                        <th scope="col">T7</th>
                        <th scope="col">T8</th>
                        <th scope="col">T9</th>
                        <th scope="col">T10</th>
                        <th scope="col">T11</th>
                        <th scope="col">T12</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($map[17]->number as $year => $months)
                    <tr>
                        <th scope="row">
                            <a indicator="{{ $map[17]->indicator }}"
                                number="{{ $year }}"
                                data-toggle="modal" data-target="#QuickInfo"
                                style="cursor: pointer"
                                class="showQuickInfo">{{ $year }}</a>
                        </th>
                            @foreach($months as $month)
                        <td>
                            <a indicator="month"
                                number="{{ $month }}"
                                data-toggle="modal" data-target="#QuickInfo"
                                style="cursor: pointer"
                                class="showQuickInfo">{{ $month }}</a>
                        </td>
                        @endforeach
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>

</div>

