<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class GJWController extends Controller
{
    public function index(Request $request)
    {
        $url = $request->input('url');
        if (!$url) {
            $url = 'ganjingworld.com';
        }
        return view('gjw.redirect-page')->with([
            'url' => $url,
            'rayId' => $this->generateRandomString()
        ]);
    }

    function generateRandomString($length = 16)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $randomString = '';

        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, strlen($characters) - 1)];
        }

        return $randomString;
    }
}
