<?php

/**
 * Laravel-admin - admin builder based on Laravel.
 * @author z-song <https://github.com/z-song>
 *
 * Bootstraper for Admin.
 *
 * Here you can remove builtin form field:
 * Encore\Admin\Form::forget(['map', 'editor']);
 *
 * Or extend custom form field:
 * Encore\Admin\Form::extend('php', PHPEditor::class);
 *
 * Or require js and css assets:
 * Admin::css('/packages/prettydocs/css/styles.css');
 * Admin::js('/packages/prettydocs/js/main.js');
 *
 */

Encore\Admin\Form::forget(['map', 'editor']);

Admin::css(env('APP_URL') . '/css/style.css');

Admin::js(env('APP_URL') . '/vendor/chartjs/dist/chart.min.js');
Admin::js(env('APP_URL') . '/vendor/chartjs-plugin-datalabels/dist/chartjs-plugin-datalabels.min.js');

// thêm script Google AdSense tài khoản ttn.nga2018@gmail.com
// Admin::headerJs('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3167317540432811');

// thêm script Google AdSense tài khoản traphucvinhuy012022@gmail.com
Admin::headerJs('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8058142871746806');
