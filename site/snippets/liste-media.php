<?php
$files = $page->files()->sortBy('sort', 'asc');
foreach ($files as $file) :
?>
	<figure class="cf" data-filename="<?php echo $file->filename() ?>">
		<?php if ($file->type() == 'image') : ?>
			<div class="swiper-image" style="background-image:url('<?php echo $file->url() ?>')"></div> 
		<?php else : ?>
			<div class="swiper-image" style="background-color:#F33;">vidéo</div> 
		<?php endif; ?>
		<div class="media-caption"><input value="<?php echo $file->caption() ?>"></div>
		<div class="media-delete btn btn-danger"><i class="glyphicon glyphicon-trash"></i></div>
	</figure>
<?php
endforeach;
?>