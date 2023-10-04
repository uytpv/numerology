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
                        <h4 class="text-center indicator-name">Đường Đời</h4>
                        <p class="text-center">
                            <a indicator="life_path"
                            number="<?php echo e($cus->life_path, false); ?>"
                            data-toggle="modal" data-target="#QuickInfo"
                            class="number showQuickInfo"><?php echo e($cus->life_path, false); ?></a>
                            </p>
                        
                    </div>
                </div>
            </div>
            <div class="col col-lg-4 col-md-4 col-xs-4">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">Sứ Mệnh</h4>
                        <p class="text-center">
                            <a indicator="expression"
                                number="<?php echo e($cus->expression, false); ?>"
                                data-toggle="modal" data-target="#QuickInfo"
                                class="number showQuickInfo"><?php echo e($cus->expression, false); ?></a>
                            </p>
                        
                    </div>
                </div>
            </div>
            <div class="col col-lg-4 col-md-4 col-xs-4">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">KN Đường Đời - Sứ Mệnh</h4>
                        <p class="text-center">
                            <a indicator="lpe_bridge"
                            number="<?php echo e($cus->lpe_bridge, false); ?>"
                            data-toggle="modal" data-target="#QuickInfo"
                            class="number showQuickInfo"><?php echo e($cus->lpe_bridge, false); ?></a></p>
                        
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
                            <a indicator="heart_desire"
                            number="<?php echo e($cus->heart_desire, false); ?>"
                            data-toggle="modal" data-target="#QuickInfo"
                            class="number showQuickInfo"><?php echo e($cus->heart_desire, false); ?></a></p>
                        
                    </div>
                </div>
            </div>
            <div class="col col-lg-4 col-md-4 col-xs-4">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">Nhân Cách</h4>
                        <p class="text-center"><a indicator="personality"
                            number="<?php echo e($cus->personality, false); ?>"
                            data-toggle="modal" data-target="#QuickInfo"
                            class="number showQuickInfo"><?php echo e($cus->personality, false); ?></a></p>
                        
                    </div>
                </div>
            </div>
            <div class="col col-lg-4 col-md-4 col-xs-4">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">KN Linh Hồn - Nhân Cách</h4>
                        <p class="text-center">
                            <a indicator="hdp_bridge"
                            number="<?php echo e($cus->hdp_bridge, false); ?>"
                            data-toggle="modal" data-target="#QuickInfo"
                            class="number showQuickInfo"><?php echo e($cus->hdp_bridge, false); ?></a></p>
                        
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col col-lg-4 col-md-4 col-xs-4">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">Cân Bằng</h4>
                        <p class="text-center">
                            <a indicator="balance"
                            number="<?php echo e($cus->balance, false); ?>"
                            data-toggle="modal" data-target="#QuickInfo"
                            class="number showQuickInfo"><?php echo e($cus->balance, false); ?></a></p>
                        
                    </div>
                </div>
            </div>
            <div class="col col-lg-4 col-md-4 col-xs-4">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">Ngày Sinh</h4>
                        <p class="text-center"><a indicator="birthday"
                            number="<?php echo e($cus->birthday, false); ?>"
                            data-toggle="modal" data-target="#QuickInfo"
                            class="number showQuickInfo"><?php echo e($cus->birthday, false); ?></a></p>
                        
                    </div>
                </div>
            </div>
            <div class="col col-lg-4 col-md-4 col-xs-4">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">Trưởng Thành</h4>
                        <p class="text-center"><a indicator="maturity"
                            number="<?php echo e($cus->maturity, false); ?>"
                            data-toggle="modal" data-target="#QuickInfo"
                            class="number showQuickInfo"><?php echo e($cus->maturity, false); ?></a></p>
                        
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col col-lg-6 col-md-6 col-xs-6">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">Tư Duy Lý Trí</h4>
                        <p class="text-center"><a indicator="rational_thought"
                            number="<?php echo e($cus->rational_thought, false); ?>"
                            data-toggle="modal" data-target="#QuickInfo"
                            class="number showQuickInfo"><?php echo e($cus->rational_thought, false); ?></a></p>
                        
                    </div>
                </div>
            </div>
            <div class="col col-lg-6 col-md-6 col-xs-6">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">Sức Mạnh Tiềm Thức</h4>
                        <p class="text-center"><a indicator="subconscious_confidence"
                            number="<?php echo e($cus->subconscious_confidence, false); ?>"
                            data-toggle="modal" data-target="#QuickInfo"
                            class="number showQuickInfo"><?php echo e($cus->subconscious_confidence, false); ?></a></p>
                        
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col col-lg-6 col-md-6 col-xs-6">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">Đam Mê Tiềm Ẩn</h4>
                        <p class="text-center">
                            <?php $__currentLoopData = json_decode($cus->hidden_passion); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $index => $number): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <a indicator="hidden_passion"
                                number="<?php echo e($number, false); ?>"
                                data-toggle="modal" data-target="#QuickInfo"
                                class="number showQuickInfo"><?php echo e($number, false); ?><?php echo e((($index + 1) < sizeof(json_decode($cus->hidden_passion))) ? ',' : '', false); ?></a>
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                        </p>
                        
                    </div>
                </div>
            </div>
            <div class="col col-lg-6 col-md-6 col-xs-6">
                <div class="box box-primary">
                    <div class="box-header">
                        <h4 class="text-center indicator-name">Chỉ Số Thiếu</h4>
                        <p class="text-center">
                            <?php $__currentLoopData = json_decode($cus->karmic_lessons); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $index => $number): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <a indicator="karmic_lessons"
                                number="<?php echo e($number, false); ?>"
                                data-toggle="modal" data-target="#QuickInfo"
                                class="number showQuickInfo"><?php echo e($number, false); ?><?php echo e((($index + 1) < sizeof(json_decode($cus->karmic_lessons))) ? ',' : '', false); ?></a>
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                        </p>
                        
                    </div>
                </div>
            </div>

        </div>
        <div class="row">
            <div id="container">
                
                <h4 class="text-center indicator-name">Sơ Đồ Chặng | Thách Thức | 4 Đỉnh Cao Cuộc Đời <strong>(<?php echo e(\Carbon\Carbon::now()->format('Y') - \Carbon\Carbon::createFromFormat('d/m/Y', $cus->dob)->format('Y'), false); ?> tuổi)</strong></h4>
                <div class="buildingBlock">
                    <a indicator="pinnacle"
                        number="<?php echo e(json_decode($cus->pinnacle)[3], false); ?>"
                        data-toggle="modal" data-target="#QuickInfo"
                        class="number showQuickInfo"><?php echo e(json_decode($cus->pinnacle)[3], false); ?></a>
                    <sub><?php echo e(json_decode($cus->age)[3], false); ?></sub></div>
                <div></div>
                <div class="buildingBlock">
                    <a indicator="pinnacle"
                        number="<?php echo e(json_decode($cus->pinnacle)[2], false); ?>"
                        data-toggle="modal" data-target="#QuickInfo"
                        class="number showQuickInfo"><?php echo e(json_decode($cus->pinnacle)[2], false); ?></a>
                    <sub><?php echo e(json_decode($cus->age)[2], false); ?></sub></div>
                <div></div>
                <div class="buildingBlock">
                    <a indicator="pinnacle"
                        number="<?php echo e(json_decode($cus->pinnacle)[0], false); ?>"
                        data-toggle="modal" data-target="#QuickInfo"
                        class="number showQuickInfo"><?php echo e(json_decode($cus->pinnacle)[0], false); ?></a>
                    <sub><?php echo e(json_decode($cus->age)[0], false); ?></sub></div>
                <div class="buildingBlock">
                    <a indicator="pinnacle"
                        number="<?php echo e(json_decode($cus->pinnacle)[1], false); ?>"
                        data-toggle="modal" data-target="#QuickInfo"
                        class="number showQuickInfo"><?php echo e(json_decode($cus->pinnacle)[1], false); ?></a>
                    <sub><?php echo e(json_decode($cus->age)[1], false); ?></sub></div>
                <div></div>
                <div class="buildingBlock">
                    <a indicator="root"
                        number="<?php echo e(json_decode($cus->root)[0], false); ?>"
                        data-toggle="modal" data-target="#QuickInfo"
                        class="number showQuickInfo"><?php echo e(json_decode($cus->root)[0], false); ?></a>
                </div>
                <div class="buildingBlock">
                    <a indicator="root"
                        number="<?php echo e(json_decode($cus->root)[1], false); ?>"
                        data-toggle="modal" data-target="#QuickInfo"
                        class="number showQuickInfo"><?php echo e(json_decode($cus->root)[1], false); ?></a>
                </div>
                <div class="buildingBlock">
                    <a indicator="root"
                        number="<?php echo e(json_decode($cus->root)[2], false); ?>"
                        data-toggle="modal" data-target="#QuickInfo"
                        class="number showQuickInfo"><?php echo e(json_decode($cus->root)[2], false); ?></a>
                </div>
                <div></div>
                <div class="buildingBlock">
                    <a indicator="challennge"
                        number="<?php echo e(json_decode($cus->challennge)[0], false); ?>"
                        data-toggle="modal" data-target="#QuickInfo"
                        class="number showQuickInfo"><?php echo e(json_decode($cus->challennge)[0], false); ?></a>
                </div>
                <div class="buildingBlock">
                    <a indicator="challennge"
                        number="<?php echo e(json_decode($cus->challennge)[1], false); ?>"
                        data-toggle="modal" data-target="#QuickInfo"
                        class="number showQuickInfo"><?php echo e(json_decode($cus->challennge)[1], false); ?></a>
                </div>
                <div></div>
                <div class="buildingBlock">
                    <a indicator="challennge"
                        number="<?php echo e(json_decode($cus->challennge)[2], false); ?>"
                        data-toggle="modal" data-target="#QuickInfo"
                        class="number showQuickInfo"><?php echo e(json_decode($cus->challennge)[2], false); ?></a>
                </div>
                <div></div>
                <div class="buildingBlock">
                    <a indicator="challennge"
                        number="<?php echo e(json_decode($cus->challennge)[3], false); ?>"
                        data-toggle="modal" data-target="#QuickInfo"
                        class="number showQuickInfo"><?php echo e(json_decode($cus->challennge)[3], false); ?></a>
                </div>
                <div></div>
             </div>
            
            
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
            url: '<?php echo e(env('APP_URL'), false); ?>/admin/showDetail/' + indicator + '/' + number,
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
<?php /**PATH /home/stackops/www/numerology/resources/views/admin/map.blade.php ENDPATH**/ ?>