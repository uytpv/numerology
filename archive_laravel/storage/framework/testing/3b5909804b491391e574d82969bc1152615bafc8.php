<style>
    .title {
        font-size: 40px;
        color: #636b6f;
        font-family: 'Raleway', sans-serif;
        font-weight: 100;
        display: block;
        text-align: center;
        /* margin: 10px 0; */
    }

    .links {
        text-align: center;
        margin-bottom: 20px;
    }

    .links > a {
        color: #636b6f;
        padding: 0 25px;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: .1rem;
        text-decoration: none;
        /* text-transform: uppercase; */
    }
</style>

<div class="title">
    Map For Success
</div>
<div class="links">
    <a href="javascript:void(0)"><?php echo e($customer->last_name .' '. $customer->first_name, false); ?> </a>
    
    <a href="javascript:void(0)"><?php echo e($customer->dob, false); ?> | <?php echo e($customer->note, false); ?></a> 
</div>

<?php /**PATH /home/stackops/www/numerology/resources/views/admin/title.blade.php ENDPATH**/ ?>