<?php
    // use App\Project;

    // $menu_projects = Project::where('is_publish', '=', 1)->get();
    $url = request()->route()->uri();
?>
<!-- Header Area wrapper Starts -->
<header id="header">
    <div class="container">
        <div class="logo"><a href="{{ env('APP_URL') }}"><img src="{{ env('APP_URL') }}/img/logo-amunselect-traogiatri.png" alt="Sports"></a></div>
        <nav id="nav">
            <div class="opener-holder">
                <a href="#" class="nav-opener"><span></span></a>
            </div>
            <a href="{{ env('APP_URL') }}" class="btn btn-primary rounded">Xem bản đồ</a>
            <div class="nav-drop">
                <ul>
                    <li class="active visible-sm visible-xs"><a href="{{ env('APP_URL') }}">Trang chủ</a></li>
                    <li><a href="{{ env('APP_URL') }}/pages/than-so-hoc-la-gi">Thần số học là gì?</a></li>
                    <li><a href="{{ env('APP_URL') }}/pages/nang-luong-cua-cac-con-so">Năng lượng con số</a></li>
                    <li><a href="{{ env('APP_URL') }}/pages/cac-chi-so">Các chỉ số</a></li>
                    <li><a href="{{ env('APP_URL') }}/pages/lien-he">Liên hệ</a></li>
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
