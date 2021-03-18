<?php
    $url = request()->route()->uri();
?>
@if (strpos($url, 'lien-he') !== 0)
<!-- Footer Section Start -->
<footer id="footer">
    <div class="container">
        {{-- <div class="footer-holder"> --}}
            <div class="row">
                <div id="cta" class="cta-footer">
                    <a href="javascript:" class="btn btn-primary rounded">Xem bản đồ</a>
                    <p>Làm chủ vận mệnh</p>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                </div>
                <div class="col-md-6 text-right">
                    <ul class="social">
                        <li><a href="javascript:"><i class="fa fa-facebook-f"></i></a></li>
                        <li><a href="javascript:"><i class="fa fa-twitter"></i></a></li>
                        <li><a href="javascript:"><i class="fa fa-dribbble"></i></a></li>
                        <li><a href="javascript:"><i class="fa fa-pinterest"></i></a></li>
                    </ul>
                </div>
            </div>
        {{-- </div> --}}
    </div>
</footer>
<!-- Footer Section End -->
@endif
