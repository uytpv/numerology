<?php
use App\Models\IndicatorNumber;
use App\Models\Indicator;
?>


<?php $__env->startSection('content'); ?>
    <section class="visual">
        <h2>Họ Tên và Ngày Sinh của bạn nói lên điều gì?</h2>
        <div class="container">

            <form class="myForm" method="post">
                <?php echo e(csrf_field(), false); ?>

                <div class="form-group">
                    <label for="email">Họ tên đầy đủ</label>
                    <input class="form-control input-lg" type="text" name="fullname" id="email"
                        placeholder="Họ tên đầy đủ" required />
                </div>
                <div class="form-group">
                    <label for="password">Ngày Sinh đầy đủ</label>
                    <input type="text" pattern="\d{1,2}/\d{1,2}/\d{4}" class="datepicker form-control input-lg"
                        name="dob" placeholder="dd/mm/yyyy" />

                </div>
                <div class="form-group">
                    <input type="submit" name="submit" class="btn btn-success btn-lg" value="Xem bản đồ" />
                </div>
            </form>
        </div>

    </section>
    <?php if(isset($customer)): ?>
        <div class="row">
            <div class="container" style="text-align: center">
                <h1><?php echo e($customer->last_name . ' ' . $customer->first_name, false); ?>

                    <?php echo e($customer->dob === '01/01/1970' ? '' : '(' . $customer->dob . ')', false); ?></h1>
            </div>
        </div>
    <?php endif; ?>

    <?php if(isset($map)): ?>
        <div class="row justify-content-md-center">
            <div class="container" style="margin:0 auto; position: relative">
                <?php if($customer->dob === '01/01/1970'): ?>
                    <div id="cta" class="cta-footer">
                        <h5 class="btn btn-primary rounded">
                            <?php echo e(Indicator::where(['code' => $map[6]->indicator])->first()->name, false); ?>

                            <span class="badge rounded-pill badge-outline-warning"
                                style="font-size: 1.2em"><?php echo e($map[6]->number, false); ?></span>
                        </h5>
                    </div>
                <?php else: ?>
                    <div class="col-sm-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h5 class="card-title">
                                    <?php echo e(Indicator::where(['code' => $map[0]->indicator])->first()->name, false); ?></h5>
                                <div class="badge rounded-pill badge-outline-warning"><?php echo e($map[0]->number, false); ?></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h5 class="card-title">
                                    <?php echo e(Indicator::where(['code' => $map[1]->indicator])->first()->name, false); ?></h5>
                                <div class="badge rounded-pill badge-outline-warning"><?php echo e($map[1]->number, false); ?></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h5 class="card-title">
                                    <?php echo e(Indicator::where(['code' => $map[3]->indicator])->first()->name, false); ?></h5>
                                <div class="badge rounded-pill badge-outline-warning"><?php echo e($map[3]->number, false); ?></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-3 ">
                        <div class="card text-center">
                            <div class="card-body">
                                <h5 class="card-title">
                                    <?php echo e(Indicator::where(['code' => $map[17]->indicator])->first()->name, false); ?>

                                </h5>
                                <div class="badge rounded-pill badge-outline-warning">
                                    
                                    <?php echo e(key($map[17]->number), false); ?> 
                                </div>
                            </div>
                        </div>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    <?php endif; ?>

<?php $__env->stopSection(); ?>

<?php echo $__env->make('layout.master', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH C:\Users\UY\works\numerology\resources\views/home.blade.php ENDPATH**/ ?>