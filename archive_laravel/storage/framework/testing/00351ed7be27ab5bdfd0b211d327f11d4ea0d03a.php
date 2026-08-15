<li class="dd-item" data-id="<?php echo e($branch[$keyName], false); ?>">
    <div class="dd-handle ">
        <span class="dd-nodrag">
            <?php if($branch['category_id'] != 0): ?>
                <a class="showQuickInfo" href="#" data-toggle="modal" data-target="#QuickInfo" onclick="getCateId(<?php echo e($branch['id'], false); ?>)"
                    cate-id="<?php echo e($branch['id'], false); ?>">
                    <i class="fa fa-plus fa-md"></i><?php echo e($branch['title'], false); ?></a>
            <?php else: ?>
                <?php echo $branch['title']; ?>

            <?php endif; ?>
        </span>
    </div>
    <?php if(isset($branch['children'])): ?>
        <ol class="dd-list">
            <?php $__currentLoopData = $branch['children']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $branch): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <?php echo $__env->make($branchView, $branch, \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </ol>
    <?php endif; ?>
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
            url: '<?php echo e(env('APP_URL'), false); ?>/admin/api/getDocuments',
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
<?php /**PATH /home/stackops/www/numerology/resources/views/admin/tree/branch.blade.php ENDPATH**/ ?>