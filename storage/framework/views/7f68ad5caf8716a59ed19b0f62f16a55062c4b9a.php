<!doctype html>
<html lang="en">
<?php echo $__env->make('layout.bootstrap.head', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>

<body>
    
    <div id="wrapper">
        <?php echo $__env->make('layout.bootstrap.header', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
        <?php echo $__env->yieldContent('content'); ?>

        <?php echo $__env->make('layout.bootstrap.footer', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
    </div>
    <?php echo $__env->make('layout.bootstrap.script', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
</body>

</html>
<?php /**PATH /home/stackops/www/numerology/resources/views/layout/bootstrap/master.blade.php ENDPATH**/ ?>