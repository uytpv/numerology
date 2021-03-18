<?php
    // use App\Project;

    // $menu_projects = Project::where('is_publish', '=', 1)->get();
    $url = request()->route()->uri();
?>
<!-- Header Area wrapper Starts -->
<header id="header">
    <div class="container">
        <div class="logo"><a href="#"><img src="{{ env('APP_URL') }}/vendor/free-css-sports/images/logo.png" alt="Sports"></a></div>
        <nav id="nav">
            <div class="opener-holder">
                <a href="#" class="nav-opener"><span></span></a>
            </div>
            <a href="javascript:" class="btn btn-primary rounded">Xem bản đồ</a>
            <div class="nav-drop">
                <ul>
                    <li class="active visible-sm visible-xs"><a href="#">Trang chủ</a></li>
                    <li><a href="#">Thần số học là gì?</a></li>
                    <li><a href="#">Năng lượng con số</a></li>
                    <li><a href="#">Các chỉ số</a></li>
                    <li><a href="#">Liên hệ</a></li>
                </ul>
                <div class="drop-holder visible-sm visible-xs">
                    <span>Follow Us</span>
                    <ul class="social-networks">
                        <li><a class="fa fa-github" href="#"></a></li>
                        <li><a class="fa fa-twitter" href="#"></a></li>
                        <li><a class="fa fa-facebook" href="#"></a></li>
                    </ul>
                </div>
            </div>
        </nav>
    </div>
</header>
<!-- Header Area wrapper End -->
