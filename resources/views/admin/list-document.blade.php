<?php 

use Encore\Admin\Auth\Database\Administrator;
use App\Models\DocumentType;
?>

@if ($doc_list->isEmpty())
<p><em>Không có tài liệu</em></p>
@else
<table class="table table-hover grid-table" id="grid-table61172a2e1ef16">
    <thead>
        <tr>
            <th class="column-title">Tên tài liệu</th>
            <th class="column-link" width=" 300px">Link</th>
            <th class="column-type_id">Loại</th>
            <th class="column-admin_id">Người tạo</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($doc_list as $row)
            <tr data-key="1">
                <td class="column-title">
                    {{ $row->title }}
                </td>
                <td class="column-link" width=" 300px">
                    <a href="{{ $row->link }}" target="_blank"
                        style="overflow-wrap: anywhere;">{{  $row->link }}</a>
                </td>
                <td class="column-type_id">
                    <span class="label label-danger">{{ DocumentType::find($row->type_id)->title }}</span>
                </td>
                <td class="column-admin_id">
                    {{ Administrator::find($row->admin_id)->name }}
                </td>
            </tr>
        @endforeach
    </tbody>
</table>
@endif

