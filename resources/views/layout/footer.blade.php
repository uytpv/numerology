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

<!-- Make a Call -->
<a href="tel:0932062322" id="alo-phoneIcon" class="alo-phone alo-green alo-show hotline-element">
    <div class="alo-ph-circle hotline-color-border"></div>
    <div class="alo-ph-circle-fill hotline-color"></div>
    <div class="alo-ph-img-circle hotline-color">
        <i class="glyphicon glyphicon-earphone"></i>
    </div>
    <span class="alo-ph-text hotline-content hotline-color">0932062322</span>
</a>
<!-- Make a Call End -->
@endif
