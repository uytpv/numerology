<?php
    $url = request()->route()->uri();
?>
@if (strpos($url, 'lien-he') !== 0)
<!-- Footer Section Start -->
<footer id="footer">
    <div class="container">
        <div class="footer-holder">
            <div class="row">
                <div id="cta" class="cta-footer">
                    <a href="{{ env('APP_URL') }}" class="btn btn-primary rounded">Xem bản đồ</a>
                    <p>Làm chủ vận mệnh</p>
                </div>
            </div>
        </div>
    </div>
</footer>
<!-- Footer Section End -->
@endif
