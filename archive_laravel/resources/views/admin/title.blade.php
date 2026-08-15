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
    <a href="javascript:void(0)">{{ $customer->last_name .' '. $customer->first_name }} </a>
    {{-- <a href="javascript:void(0)">{{ date('d-m-Y', strtotime($customer->dob)) }}</a> --}}
    <a href="javascript:void(0)">{{ $customer->dob }} | {{ $customer->note  }}</a> 
</div>

