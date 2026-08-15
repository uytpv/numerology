<script type="text/javascript" src="{{ env('APP_URL') }}/vendor/uxos/js/jquery-3.4.1.min.js"></script>
<script type="text/javascript" src="{{ env('APP_URL') }}/vendor/uxos/js/bootstrap.js"></script>

<script>
    function openNav() {
        document.getElementById("myNav").classList.toggle("menu_width");
        document
            .querySelector(".custom_menu-btn")
            .classList.toggle("menu_btn-style");
    }
</script>
