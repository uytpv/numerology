<li class="dd-item" data-id="{{ $branch[$keyName] }}">
    <div class="dd-handle ">
        <span class="dd-nodrag">
            @if ($branch['category_id'] != 0)
                <a class="showQuickInfo" href="#" data-toggle="modal" data-target="#QuickInfo" onclick="getCateId({{ $branch['id'] }})"
                    cate-id="{{ $branch['id'] }}">
                    <i class="fa fa-plus fa-md"></i>{{ $branch['title'] }}</a>
            @else
                {!! $branch['title'] !!}
            @endif
        </span>
    </div>
    @if (isset($branch['children']))
        <ol class="dd-list">
            @foreach ($branch['children'] as $branch)
                @include($branchView, $branch)
            @endforeach
        </ol>
    @endif
</li>


<!-- MODAL -->
<div class="modal grid-modal fade in" id="QuickInfo" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content" style="border-radius: 5px;">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span>×</span></button>
                <h4 class="modal-title">Danh sách tài liệu</h4>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div id="description" class="col col-lg-12">
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    function getCateId(cate_id){
        $('#QuickInfo').toggleClass('is-active');
        getDocumentList(cate_id);
    }
    $('#QuickInfo').on('hidden.bs.modal', function() {
        $('#short-description').empty();
        $('#description').empty();
    });

    function getDocumentList(cate_id) {
        $.ajax({
            url: '{{ env('APP_URL') }}/admin/api/getDocuments',
            data: {
                cate_id: cate_id,
            },
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                $('#description').append(response.html);
            },
        });
    }
</script>
