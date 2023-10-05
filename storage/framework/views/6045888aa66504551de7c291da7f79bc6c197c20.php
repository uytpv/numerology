<style>
    .title {
        font-size: 50px;
        color: #636b6f;
        font-family: 'Raleway', sans-serif;
        font-weight: 100;
        display: block;
        text-align: center;
        margin: 20px 0 10px 0px;
    }

    .links {
        text-align: center;
        margin-bottom: 20px;
    }

    .links>a {
        color: #636b6f;
        padding: 0 25px;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: .1rem;
        text-decoration: none;
        text-transform: uppercase;
    }

</style>
<section class="content">
    <div class="row">
        <div class="col-md-12">
            <div class="title">
                Map For Success
            </div>
            <div class="links">
                <a href="javascript:void(0)">--- oOo --- </a>
            </div>
        </div>
    </div>
    <div class="row">

        <div class="col-md-4">
            <div class="box box-default">
                <div class="box-header with-border">
                    <h3 class="box-title">Sinh nhật trong hôm nay!</h3>
                </div>

                <!-- /.box-header -->
                <div class="slimScrollDiv" style="position: relative; overflow: hidden; width: auto;">
                    <div class="box-body dependencies" style="overflow: hidden; width: auto; ">
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <tbody>
                                    <?php if(count($today_birthday_customers) > 0): ?>
                                        <?php $__currentLoopData = $today_birthday_customers; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $cus): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                            <tr>
                                                <td width="240px"><a href="admin/showMap/<?php echo e($cus->id, false); ?>"><?php echo e($cus->last_name, false); ?>

                                                    <?php echo e($cus->first_name, false); ?></a></td>
                                            <td><span class="label label-primary"><?php echo e($cus->dob, false); ?></span></td>
                                            </tr>
                                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                    <?php else: ?>
                                        <tr>
                                            <td width="240px">Hôm nay không có sinh nhật</td>
                                            <td></td>
                                        </tr>
                                    <?php endif; ?>
                                </tbody>
                            </table>
                        </div>
                        <!-- /.table-responsive -->
                    </div>
                    <div class="slimScrollBar"
                        style="background: rgb(0, 0, 0); width: 3px; position: absolute; top: 0px; opacity: 0.4; display: none; border-radius: 7px; z-index: 99; right: 1px;">
                    </div>
                    <div class="slimScrollRail"
                        style="width: 3px; height: 100%; position: absolute; top: 0px; display: none; border-radius: 7px; background: rgb(51, 51, 51); opacity: 0.2; z-index: 90; right: 1px;">
                    </div>
                </div>
                <!-- /.box-body -->
            </div>
        </div>
        <div class="col-md-4">
            <div class="box box-default">
                <div class="box-header with-border">
                    <h3 class="box-title">Ngày mai</h3>

                    <div class="box-tools pull-right">
                        <button type="button" class="btn btn-box-tool" data-widget="collapse"><i
                                class="fa fa-minus"></i>
                        </button>
                        <button type="button" class="btn btn-box-tool" data-widget="remove"><i
                                class="fa fa-times"></i></button>
                    </div>
                </div>

                <!-- /.box-header -->
                <div class="slimScrollDiv" style="position: relative; overflow: hidden; width: auto;">
                    <div class="box-body dependencies" style="overflow: hidden; width: auto;">
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <tbody>
                                    <?php if(count($tomorow_birthday_customers) > 0): ?>
                                        <?php $__currentLoopData = $tomorow_birthday_customers; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $cus): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                            <tr>
                                                <td width="240px"><a href="admin/showMap/<?php echo e($cus->id, false); ?>"><?php echo e($cus->last_name, false); ?>

                                                        <?php echo e($cus->first_name, false); ?></a></td>
                                                <td><span class="label label-primary"><?php echo e($cus->dob, false); ?></span></td>
                                            </tr>
                                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                    <?php else: ?>
                                        <tr>
                                            <td width="240px">Ngày mai không có sinh nhật</td>
                                            <td></td>
                                        </tr>
                                    <?php endif; ?>
                                </tbody>
                            </table>
                        </div>
                        <!-- /.table-responsive -->
                    </div>
                    <div class="slimScrollBar"
                        style="background: rgb(0, 0, 0); width: 3px; position: absolute; top: 0px; opacity: 0.4; display: none; border-radius: 7px; z-index: 99; right: 1px;">
                    </div>
                    <div class="slimScrollRail"
                        style="width: 3px; height: 100%; position: absolute; top: 0px; display: none; border-radius: 7px; background: rgb(51, 51, 51); opacity: 0.2; z-index: 90; right: 1px;">
                    </div>
                </div>
                <!-- /.box-body -->
            </div>
        </div>
        <div class="col-md-4">
            <div class="box box-default">
                <div class="box-header with-border">
                    <h3 class="box-title">Sinh nhật 7 ngày tiếp theo</h3>

                    <div class="box-tools pull-right">
                        <button type="button" class="btn btn-box-tool" data-widget="collapse"><i
                                class="fa fa-minus"></i>
                        </button>
                        <button type="button" class="btn btn-box-tool" data-widget="remove"><i
                                class="fa fa-times"></i></button>
                    </div>
                </div>

                <!-- /.box-header -->
                <div class="slimScrollDiv" style="position: relative; overflow: hidden; width: auto;">
                    <div class="box-body dependencies" style="overflow: hidden; width: auto;">
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <tbody>
                                    <?php if(count($nextweek_birthday_customers) > 0): ?>
                                        <?php $__currentLoopData = $nextweek_birthday_customers; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $cus): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                            <tr>
                                                <td width="240px"><a href="admin/showMap/<?php echo e($cus->id, false); ?>"><?php echo e($cus->last_name, false); ?>

                                                        <?php echo e($cus->first_name, false); ?></a></td>
                                                <td><span class="label label-primary"><?php echo e($cus->dob, false); ?></span></td>
                                            </tr>
                                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                    <?php else: ?>
                                        <tr>
                                            <td width="240px">7 ngày tiếp theo không có sinh nhật</td>
                                            <td></td>
                                        </tr>
                                    <?php endif; ?>
                                </tbody>
                            </table>
                        </div>
                        <!-- /.table-responsive -->
                    </div>
                    <div class="slimScrollBar"
                        style="background: rgb(0, 0, 0); width: 3px; position: absolute; top: 0px; opacity: 0.4; display: none; border-radius: 7px; z-index: 99; right: 1px;">
                    </div>
                    <div class="slimScrollRail"
                        style="width: 3px; height: 100%; position: absolute; top: 0px; display: none; border-radius: 7px; background: rgb(51, 51, 51); opacity: 0.2; z-index: 90; right: 1px;">
                    </div>
                </div>
                <!-- /.box-body -->
            </div>
        </div>
    </div>

</section>
<?php /**PATH C:\Users\UY\works\numerology\resources\views/admin/home.blade.php ENDPATH**/ ?>