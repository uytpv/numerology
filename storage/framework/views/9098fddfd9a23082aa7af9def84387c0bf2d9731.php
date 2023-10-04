<?php 

use Encore\Admin\Auth\Database\Administrator;
use App\Models\DocumentType;
?>

<?php if($doc_list->isEmpty()): ?>
<p><em>Không có tài liệu</em></p>
<?php else: ?>
<table class="table table-hover grid-table" id="grid-table61172a2e1ef16">
    <thead>
        <tr>
            <th class="column-title">Tên tài liệu</th>
            <th class="column-link" width=" 300px">Link</th>
            <th class="column-type_id">Loại</th>
            
        </tr>
    </thead>
    <tbody>
        <?php $__currentLoopData = $doc_list; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $row): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <tr data-key="1">
                <td class="column-title" width="40%">
                    <?php echo e($row->title, false); ?>

                </td>
                <td class="column-link" width="40%">
                    <a href="<?php echo e($row->link, false); ?>" target="_blank"
                        style="overflow-wrap: anywhere;"><?php echo e($row->link, false); ?></a>
                </td>
                <td class="column-type_id">
                    <span class="label label-danger"><?php echo e(DocumentType::find($row->type_id)->title, false); ?></span>
                </td>
                
            </tr>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </tbody>
</table>
<?php endif; ?>

<?php /**PATH /home/stackops/www/numerology/resources/views/admin/list-document.blade.php ENDPATH**/ ?>