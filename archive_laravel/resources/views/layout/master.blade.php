<!DOCTYPE html>
<html>
@include('layout.head')
<body>
<div id="wrapper">
		@include('layout.header')
        @yield('content')

	@include('layout.footer')
</div>
@include('layout.script')
</body>
</html>
