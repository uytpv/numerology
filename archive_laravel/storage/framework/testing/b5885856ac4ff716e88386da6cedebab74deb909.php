<?php
    use  App\Models\IndicatorNumber;
    use  App\Models\Indicator;
?>

<div class="box-body">
    <div class="row">
        <div class="col col-lg-12">
            <div class="box box-primary">
                <div class="box-header">
                    <h4 class="text-center">Chỉ Số Năm Cá Nhân</h4>
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
                    <?php $__currentLoopData = json_decode($cus->year); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $year => $months): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <tr>
                        <th scope="row">
                            <a indicator="Năm"
                                number="<?php echo e($year, false); ?>"
                                data-toggle="modal" data-target="#QuickInfo"
                                style="cursor: pointer"
                                class="showQuickInfo"><?php echo e($year, false); ?></a>
                        </th><?php  ?>
                            <?php $__currentLoopData = $months; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $month): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                        <td>
                            <a indicator="month"
                                number="<?php echo e($month, false); ?>"
                                data-toggle="modal" data-target="#QuickInfo"
                                style="cursor: pointer"
                                class="showQuickInfo"><?php echo e($month, false); ?></a>
                        </td>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </tr>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php /**PATH /home/stackops/www/numerology/resources/views/admin/year.blade.php ENDPATH**/ ?>