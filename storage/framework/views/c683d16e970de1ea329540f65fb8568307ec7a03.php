<?php
    // use App\Project;

    // $menu_projects = Project::where('is_publish', '=', 1)->get();
    $url = request()->route()->uri();
?>
<!-- Header Area wrapper Starts -->
<header id="header">
    <div class="container">
        <div class="logo"><a href="<?php echo e(env('APP_URL'), false); ?>"><img src="<?php echo e(env('APP_URL'), false); ?>/img/logo-amunselect-traogiatri.png" alt="Sports"></a></div>
        <nav id="nav">
            <div class="opener-holder">
                <a href="#" class="nav-opener"><span></span></a>
            </div>
            
            <div class="nav-drop">
                <ul>
                    <li class="active visible-sm visible-xs"><a href="<?php echo e(env('APP_URL'), false); ?>">Trang chủ</a></li>
                    <li><a href="<?php echo e(env('APP_URL'), false); ?>/pages/than-so-hoc-la-gi">Thần số học là gì?</a></li>
                    <li><a href="<?php echo e(env('APP_URL'), false); ?>/pages/nang-luong-cua-cac-con-so">Năng lượng con số</a></li>
                    <li><a href="<?php echo e(env('APP_URL'), false); ?>/pages/cac-chi-so">Các chỉ số</a></li>
                    <li><a href="<?php echo e(env('APP_URL'), false); ?>/pages/lien-he">Liên hệ</a></li>
                    <li><a href="<?php echo e(env('APP_URL'), false); ?>/pages/banh-xe-cuoc-doi">BXCĐ</a></li>
                </ul>
                <div class="drop-holder visible-sm visible-xs">
                    <span>Follow Us</span>
                    <ul class="social-networks">
                        <li><a class="fa fa-facebook" target="_blank" href="https://www.facebook.com/masterngochue"></a></li>
                    </ul>
                </div>
            </div>
        </nav>
    </div>
</header>
<!-- Header Area wrapper End -->
<?php /**PATH /home/stackops/www/numerology/resources/views/layout/header.blade.php ENDPATH**/ ?>