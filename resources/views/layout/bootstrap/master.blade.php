<!doctype html>
<html lang="en">
@include('layout.bootstrap.head')

<body>
    
    <div id="wrapper">
        @include('layout.bootstrap.header')
        @yield('content')

        @include('layout.bootstrap.footer')
    </div>
    @include('layout.bootstrap.script')
</body>

</html>
