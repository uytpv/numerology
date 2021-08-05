<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class StaticPageController extends Controller
{
    public function index($page_name)
    {
        return view('static-pages.'.$page_name);
    }
}
