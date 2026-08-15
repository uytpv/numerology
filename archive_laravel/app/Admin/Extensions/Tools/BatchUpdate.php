<?php

namespace App\Admin\Extensions\Tools;

use Encore\Admin\Grid\Tools\BatchAction;

class BatchUpdate extends BatchAction
{
    protected $action;

    public function __construct($action = 1)
    {
        $this->action = $action;
    }

    public function script()
    {
        return <<<EOT
        
$('{$this->getElementClass()}').on('click', function() {

    $.ajax({
        method: 'post',
        url: '{$this->resource}/batch-update',
        data: {
            _token:LA.token,
            ids:  $.admin.grid.selected()
        },
        success: function () {
            $.pjax.reload('#pjax-container');
            toastr.success('Cập nhật hàng loạt thành công!');
        }
    });
});

EOT;
    }
}
