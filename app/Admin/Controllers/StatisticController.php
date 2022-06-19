<?php

namespace App\Admin\Controllers;

use App\Http\Controllers\Controller;
use Encore\Admin\Facades\Admin;
use Encore\Admin\Layout\Content;
use Illuminate\Support\Facades\DB;

class StatisticController extends Controller
{
    protected $title = 'Tài liệu Giao diện chỉ xem';

    /**
     * Index interface.
     *
     * @return Content
     */
    public function index()
    {
        $data = DB::select('SELECT life_path, 
                                count(life_path) as life_path_count, 
                                count(life_path) * 100.0 / (select count(*) from customers WHERE life_path <> "") as life_path_percent 
                            FROM customers 
                            WHERE life_path <> "" 
                            GROUP BY life_path;');
        // dd($data);
        $labels = [];
        $life_path_percent = [];
        $life_path_count = [];
        foreach ($data as $item) {
            array_push($labels, $item->life_path);
            array_push($life_path_percent, number_format((float)$item->life_path_percent, 1, '.', ''));
            array_push($life_path_count, $item->life_path_count);
        }
        return Admin::content(function (Content $content) use ($labels, $life_path_count, $life_path_percent) {
            $content->header('Statistic');
            $content->description('Thống kê tỷ lệ các con số theo Đường Đời');

            $content->body(view('admin.charts.pie')->with('data', ['labels' => $labels, 'life_path_count' => $life_path_count, 'life_path_percent' => $life_path_percent]));
        });
    }
}
