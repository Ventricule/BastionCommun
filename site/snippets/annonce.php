<?php
$currentCategorie = $page->categorie();
$currentCategorieTitle = page('categories/'.$currentCategorie)->title();
?>

<main class="main viewMode" id="annonce" data-uri="<?php echo $page->uri() ?>" role="main">
		
<!-- VALIDATION BUTTON -->
	<div id="controlButtons" class="usersOnly">
		<div class="text-left pull-left">
			<?php $page->private()->bool() ? $checked = "checked" : $checked = false ; ?>
			<input id="toggle-public" <?php echo $checked ?> data-toggle="toggle" data-on="Privé" data-off="Public" data-onstyle="default" data-size="large" type="checkbox" data-populate="private" disabled>
		</div>
		<div class="text-right pull-right">
			<?php snippet('annonce-editor', array('page' => $page)) ?>
		</div>
	</div>			


  <div class="container-fluid">
		<div class="row">
			<div class="col-sm-12" id="content-titraille">				
				<!-- TITLE -->
				<h2 id="field-title">
					<span class="simpleEdit" data-populate="title"><?php echo $page->title() ?></span>
				</h2>
				<h3 class="viewOnly"><?php echo $currentCategorieTitle ?></h3>
				<h3 class="editOnly" >
					<ul role="tablist">
						<li role="presentation" class="dropdown active" data-populate="categorie">
							<a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-expanded="false">
								<span class="current">—</span> <span class="caret"></span>
							</a>
							<ul class="dropdown-menu" role="menu" data-populate="categorie">
								<?php
								$currentCategorie = $page->categorie();
								$currentCategorieTitle = page('categories/'.$currentCategorie)->title();
								foreach (page('categories')->children() as $categorie) :
									$active = ( $currentCategorie == $categorie->uid() ) ?  'class="active"' : '' ;
									echo "<li {$active} data-value='{$categorie->uid()}'>";
									echo "<a href='#cat-{$categorie->uid()}' role='tab' data-toggle='tab'>{$categorie->title()}</a>";
									echo "</li>";
								endforeach;
								?>
							</ul>
						</li>
					</ul>
				</h3>
			</div>
		</div>
	
		<div class="row">

			<!-- MAIN TEXT -->
			<div id="description" class="col-xs-9">
				<?php snippet('viewer', array('page' => $page)); ?>
				<div id="field-description" class="fullEdit" data-placeholder="Texte de l'annonce"><?php echo $page->description()->kirbytext() ?></div>
			</div>

			<!-- META -->
			<div id="informations" class="col-xs-3 readonly">  
				<?php snippet('meta', array('page' => $page)) ?>
			</div>

		</div>

		<!-- BOTTOM LINKS -->
		<div id="bottomLinks">
			<div id="saveAd"></div>
			<div id="advise"></div>
			<div id="btFb"></div>
			<div id="btTweeter"></div>
		</div>

		<!-- COMMENTS -->
		<div id="comments"></div>
  
  </div> <!-- /container-fluid -->

</main>
