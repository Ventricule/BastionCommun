
$(window).resize(function(){
	
});

$(document).ready(function (){
	
	$.fn.datepicker.dates['fr'] = {
		days: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
		daysShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
		daysMin: ["D", "L", "Ma", "Me", "J", "V", "S", "D"],
		months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
		monthsShort: ["Jan", "Fev", "Mar", "Avr", "Mai", "Jui", "Jul", "Aou", "Sep", "Oct", "Nov", "Dec"],
		today: "Aujourd'hui",
		weekStart: 1
	};
	
	/* SMARTSUBMIT
	------------------------------------ */
	
	// honeypot
	smart_submit_honeypot = function() {
		$(".smart-submit-honeypot").each(function() { 
			$(this).attr("value", parseInt($(this).attr("value")) + 1);
		});
		setTimeout("smart_submit_honeypot()", 1000);
	}
	
	// init
	initSmartSubmit = function(form) {
		//find response div
		if (form.attr('data-response-div')) {
			var responseDiv = $('#' + form.attr('data-response-div'));
		} else if (form.attr('data-reload') == "1") {
			var reloadPage = true;
		} else {
			var responseDiv = false;
		}

		// create honeypot
		form.append('<input type="hidden" name="smart-submit-honeypot" class="smart-submit-honeypot" value="0">');

		// start honeypot
		smart_submit_honeypot(); 

		// catch form submission
		form.on('submit', function(e){
			console.log($(this).serialize());
			e.preventDefault();
			
			// clear previous response
			if (responseDiv) responseDiv.html('');

			// submit
			$.ajax({
				url: $(this).prop('action'),
				data: $(this).serialize(),
				type: 'post',
				success: function(data) {
					if(data) {
						if (responseDiv) {
							if (responseDiv == '#annonce') {
								loadAnnonce($('#annonce').attr('data-uri'));
								reloadAnnoncesList();
							} else {
								responseDiv.html(data);
							}
						}
						if(reloadPage) {
							loadAnnonce($('#annonce').attr('data-uri'));
						}
						if (data.success) {
							$('main').addClass('viewMode').removeClass('editMode');
						}
						else if (data.redirect)	{
							window.location = data.redirect;
						}
					}
				}
			});

			return false;
		});
	}
	
	/* HOME
	-------------------------------------------- */

    // To do : Loader ?
	setTimeout(function(){ $('#cover').fadeOut(200) }, 0);

  /*  Annonce
  -------------------------------------------- */
	/* functions */
	function inputsGroupToField(group, field) {
		var fields = {};
		group.find('.input').each(function(i) {
			fields[$(this).attr("data-slug")] = $(this).val();
		});
		$( field ).val( JSON.stringify(fields) );
	}
	
	/* update */
	function updateSwiperVisibility(swiper) {
		if (!swiper.slides.length) {
			swiper.container.hide();
		} else if (swiper.slides.length <= 3) {
			swiper.container.show();
			$('.swiper-pagination, .swiper-button-next, .swiper-button-prev').hide();
		} else {
			swiper.container.show();
			$('.swiper-pagination, .swiper-button-next, .swiper-button-prev').show();
		}
	}
	
	function initSwiper(){
		var gallery = new Swiper('.swiper-container', {
			pagination: '.swiper-pagination',
			nextButton: '.swiper-button-next',
			prevButton: '.swiper-button-prev',
			slidesPerView: 1,
			paginationClickable: true,
			spaceBetween: 30,
			loop: true,
			grabCursor: true,
			onInit: function (swiper) {
				updateSwiperVisibility(swiper);
			}
		});
		return gallery;
	}
	
	function annonceUpdate() {
		
		var editors=[];
		
		// Mode édition
		if(window.location.hash.substring(1)=='edit') {
			$('.editButton').click();
			window.location.hash = '';
		}
		
		/***** buttons *****/
		
		/* edit */
		$('.editButton').click(function() {
			$('main').removeClass('viewMode').addClass('editMode');
			$(this).parent().find('.submitButton').show();
			$(".inputsGroup .input").attr('readonly', false);
			$("#informations").removeClass('readonly');
			$('#toggle-public').bootstrapToggle('enable');
			inputsGroupToField( $('.inputsGroup.active'), "#hidden-" + $('.inputsGroup.active').attr('data-populate') );
			$("input[type='checkbox']").each(function() {
				$( "#hidden-" + $(this).attr('data-populate') ).val($(this).prop('checked'));
			});

			$(".inputsGroup .input").on('input change', function() {
				var inputsGroup = $(this).parents('.inputsGroup');
				inputsGroupToField( inputsGroup , "#hidden-" + inputsGroup.attr('data-populate') );
			});

			$("input[type='checkbox']").change(function() {
				$( "#hidden-" + $(this).attr('data-populate') ).val($(this).prop('checked'));
			});

			$(".simpleEdit").each(function() {
				var field = $(this);
				editors.push( new MediumEditor( $(this), {
					disableReturn: true,
					buttons: [],
					extensions: {
						markdown: new MeMarkdown(function (md) {
							var fieldToPopulate = field.attr('data-populate');
							$("#hidden-" + fieldToPopulate).val(md);
						})
					}
				}));
			});	
			$(".fullEdit").each(function() {
				editors.push( new MediumEditor(".fullEdit", {
					buttons: ['bold', 'italic', 'anchor', 'quote'],
					buttonLabels: 'fontawesome',
					extensions: {
						markdown: new MeMarkdown(function (md) {
							$('#hidden-description').val(md);
						})
					}
				}));
			});
			geopicker();
		});
		/* cancel */
		$('.cancelButton').click(function() {
			loadAnnonce($('#annonce').attr('data-uri'));
		});
		/* submit */
		$('.submitButton').click(function() {
			loadAnnonce($('#annonce').attr('data-uri'));
		});
		/* Delete */
		$(document).on('click', '#button-delete-annonce', function(e) {
			$.post(BASTION.smartSubmitUrl + "?handler=delete", 
				{
					type : 'page',
					page : $('#annonce').attr('data-uri')
				},
				function(response) {
					$('#modal-delete').modal('hide');
					$('#content').html('');
					reloadAnnoncesList();
					//$('#liste-annonces .annonce-mini').first().click();
				}
			);
		});
		
		/***** tools *****/

		/* dropdowns */
		$(".dropdown-menu li a").on('click', function(){
			var fieldToPopulate = $(this).parents('.dropdown').attr('data-populate');
			var value = $(this).parent('li').attr('data-value');
			$("#hidden-" + fieldToPopulate).val(value);
			$(this).parents('.dropdown').find(".current").html($(this).text());
		});
		$(".dropdown-menu li.active a").click();
		/* datepicker */
		$('.datepicker').datepicker({ autoclose:true, weekStart:1, language:'fr' });
		/* toggle */
		$('.bootstrap-toggle').bootstrapToggle();
	  	/* gallery */
		gallery = initSwiper();
		/* smart-submit */
		$('form.smart-submit').each(function() {
			initSmartSubmit($(this));
		});


		/* geopicker */
		function geopicker(){
			if( $('main').find('input#geopicker-address-buffer').length ){
				var input = $('#geopicker-address-buffer');
				var location = {'latitude' : 48.573392, 'longitude': 7.752353}; // default
			    var setZoom = 2, setScroll = false;
				try {
					var data = JSON.parse( input.attr('data-gps') );
					if (data && typeof data === "object" && data.longitude !== 'undefined' && data.latitude !== undefined) {
						console.log(data);
						location = data;
						setZoom = 15;
					} 
				}
				catch (e) { }
				function updateControls(addressComponents, currentLocation) {
					$('#geopicker').locationpicker('autosize');
					$('#geopicker-street').val(addressComponents.addressLine1);
					$('#geopicker-city').val(addressComponents.city);
					$('#geopicker-zip').val(addressComponents.postalCode);
					$('#geopicker-country').val(addressComponents.country);

					var geoJson = JSON.stringify({ latitude: currentLocation.latitude, longitude: currentLocation.longitude, street: $('#geopicker-street').val(), city: $('#geopicker-city').val(), zip: $('#geopicker-zip').val(), country: $('#geopicker-country').val() });
					console.log($('#geopicker-address-buffer').val());
					$('#geopicker-address').val( geoJson ).attr('value', geoJson);
					var inputsGroup = $('#geopicker-address').parents('.inputsGroup');
					inputsGroupToField( inputsGroup , "#hidden-" + inputsGroup.attr('data-populate') );
					console.log('updated');

				}
				$('#geopicker').locationpicker({
					location: {latitude: location.latitude, longitude: location.longitude},	
					radius: 0,
					enableAutocomplete: true,
				    scrollwheel: setScroll,
				    zoom: setZoom,
					//enableReverseGeocode: false,
					inputBinding: {
							latitudeInput: $('#geopicker-lat'),
							longitudeInput: $('#geopicker-lon'),
							locationNameInput: $('#geopicker-address-buffer')
					},
					onchanged: function (currentLocation, radius, isMarkerDropped) {
							var addressComponents = $(this).locationpicker('map').location.addressComponents;
							updateControls(addressComponents, currentLocation);
							console.log('changed');
					},
					oninitialized: function(component) {
							var addressComponents = $(component).locationpicker('map').location.addressComponents;
							var currentLocation = {'latitude': $(component).locationpicker('map').location.latitude, 'longitude': $(component).locationpicker('map').location.longitude};
							updateControls(addressComponents, currentLocation);
					}
				});
				$('#geopicker').click(function(e) {
					console.log('yo');
					setScroll = true;
				});

				if(typeof location !== "undefined") {
					var mapContext = $('#geopicker').locationpicker('map');
					if(location.city == undefined){
						$('#geopicker-address-buffer').val('')
					}
					$('#geopicker-street').val(location.street);
					$('#geopicker-city').val(location.city);
					$('#geopicker-zip').val(location.zip);
					$('#geopicker-country').val(location.country);
					var currentLocation = {'latitude': location.latitude, 'longitude': location.longitude};
					updateControls(location, currentLocation);
				}
			}
		};
		geopicker();



		// AUTOCOMPLETE
		$('.autocomplete').each(function() {
			$(this).autocomplete({
				serviceUrl: BASTION.smartSubmitUrl + "?handler=autocomplete",
				params: { field: $(this).attr('data-slug') }
			});
		});

		// IMAGES UPLOAD
		$('#fileupload').fileupload({
			dataType: 'json',
			add : function (e, data) {
				$('#progress').fadeIn();
				if (data.autoUpload || (data.autoUpload !== false &&
								$(this).fileupload('option', 'autoUpload'))) {
					data.process().done(function () {
							data.submit();
					});
				}
			},
			done: function (e, data) {
				$('#uploader-message').text('Images ajoutés : ');
				$('#progress').fadeOut();
				$.each(data.result.files, function (index, file) {
					updateMediaList()
				});
			},
			progressall: function (e, data) {
				var progress = parseInt(data.loaded / data.total * 100, 10);
				$('#progress .progress-bar').css(
					'width',
					progress + '%'
				);
			}
		}).prop('disabled', !$.support.fileInput)
			.parent().addClass($.support.fileInput ? undefined : 'disabled');

		// IMAGES DELETE
		$('#swiper-button-delete').click(function() {
			$.post(BASTION.smartSubmitUrl + "?handler=delete", 
				{
					type : 'file',
					file : $('.swiper-slide-active').data('filename'),
					page : $('#slider').data('pageuri')
				},
				function() {
					var i = gallery.activeIndex -1;
					gallery.removeSlide(i);
					gallery.update();
					updateSwiperVisibility(gallery);
				}
			);

		});

		// TOOLTYPE
		$(function () {
			$('[data-toggle="tooltip"]').tooltip()
		})

		// CATEGORIE SELECT
		$('#categorie-select').change(function() {
			var categorie = $(this).val();
			$('#informations .fieldsGroup').removeClass('selected');
			$('#informations .fieldsGroup.categorie-'+categorie).addClass('selected');
		});
		
		$('.column').perfectScrollbar('update');
		
		// FOLLOW COMMENTS
		$('#toggle-follow').change(function(){
			$.ajax({
				url: BASTION.smartSubmitUrl + "?handler=follow-comment",
				data: { user: $('main#annonce').attr('data-user'), page: $('main#annonce').attr('data-uri'), follow: $(this).prop('checked') },
				type: 'post',
				success: function(data) {
					console.log(data);
				}
			});
		})
		$('#toggle-follow').trigger('change');
	}
	annonceUpdate();

	/* menu */
	$("#categories, body").on('click', function(){
		setTimeout(function() {
			$this = $('#categories');
			var menu = $this.children('.btn-group.bootstrap-select');
			if(menu.hasClass('open')){
				$this.addClass('open front');
			} else {
				$this.removeClass('open')
				setTimeout(function() {$this.removeClass('front');}, 300);
			}
		}, 1);
	})
	/* ANNONCES
	------------------------------------ */
	
	function loadAnnonce(uri) {
		$('.annonce-mini').removeClass('active');
		$('.annonce-mini[data-uri="'+uri+'"]').addClass('active');
		$('#loadingContainer').removeClass('hidden');
		$('#content').addClass('loading');
		$.ajax({
				url: BASTION.smartSubmitUrl + "?handler=view",
				data: { uri : uri },
				type: 'post',
				success: function(data) {
					if(data) {
						$('#megabloc').removeClass('homepage');
						$('#content').fadeIn(100, function() { $(this).html(data); annonceUpdate(); }).removeClass('loading');
						$('#loadingContainer').addClass('hidden');

						if(history.pushState) {
							history.pushState(null, null, BASTION.siteUrl+"/"+uri);
						}
					}
				}
			});
	}
	function reloadAnnoncesList() {
		$('#form-annonces').submit()
	}
	
	// search fields
	$('.selectpicker').selectpicker();


	var empty;
	function searchToggle(){
		if( $('#searchbar').hasClass('active') ){
			$('#searchbar').removeClass('active').find('#search').blur();
			$('#searchbutton').removeClass('glyphicon-remove').addClass('glyphicon-search');
		} else {
			$('#searchbar').addClass('active').find('#search').focus();
			$('#searchbutton').removeClass('glyphicon-search').addClass('glyphicon-remove');
			$('#searchbar input').val('')
			empty = true;
		}
	}
	$(document).on('click', '#searchbutton', function(){
		searchToggle();
	});
	$('#searchbar input').keydown(function(e){
	    if(e.keyCode == 8 && empty) {
	        $('.scope').remove();
	    }
	});
	$('html').keydown(function(e){
	    if(e.keyCode == 27 && $('#searchbar').hasClass('active')) {
	        searchToggle();
	    }
	});
	$('#searchbar').on('input', function() {
		var inputValue = $('#searchbar input').val();
    	if (inputValue){
    		empty = false;
    	} else {
    		empty = true;
    	}
	});

	$("#form-annonces select").change(function() { $(this.form).find('input[type="submit"]').click() });
	
	$(document).on('click', '#liste-annonces .annonce-mini', function(e){
		e.preventDefault();
		loadAnnonce($(this).attr('data-uri'));
		$('#column-content').animate({ scrollTop:0 }, 500);
		$('#column-content').perfectScrollbar('update');  // Update
		$('#megabloc').toggleClass('showContent');
	});
	
	$(document).on('click', '#button-create-annonce', function(e) {
		var categorie = $('#nouvelle-annonce-categorie').val();
		var titre = $('#nouvelle-annonce-titre').val();
		$.post(BASTION.smartSubmitUrl + "?handler=create", 
			{
				cat : categorie,
				titre : titre
			},
			function(response) {
				$('#modal-create').modal('hide');
				var uri = response.uri;
				loadAnnonce(uri);
				$('.editButton').trigger('click');
			}
		);
	});
	
	
	
	/* LISTE DES NOUVEAUX COMMENTAIRES
	------------------------------------ */	
	$("#column-annonces #profileButton li a").click(function(e) {
		e.preventDefault();
		var lien = $(this).parent();
		var uri = lien.attr('data-uri');
		loadAnnonce(uri);
		$.post(BASTION.smartSubmitUrl + "?handler=reset-comments", 
				{
					uri : uri,
				},
				function(response) {
					lien.fadeOut();
					var totalComsNum = parseInt( $('#newComs').html() );
					var thisComsNum = parseInt( lien.attr('data-num') );
					var totalComsNum = totalComsNum - thisComsNum;
					if(totalComsNum>0) {
						$('#newComs').html(totalComsNum) ;
					} else {
						$('#newComs').fadeOut() ;
					}
					
				}
			);
	});
	
	/* ADD VIDEO
	------------------------------------ */
	$(document).on('click', '#button-add-video', function(e) {

		var videoUrl = $(this).parent().siblings('.modal-body').find('#add-video-url').val(), annonceUri = $('main#annonce').attr('data-uri');
		$('#modal-add-video').modal('hide');
		$.ajax({
			url: BASTION.smartSubmitUrl + "?handler=add-video",
			data: { annonceUri: annonceUri, videoUrl: videoUrl  },
			type: 'post',
			success: function(data) {
				updateMediaList();
			}
		})
	})
	
	/* MANAGE MEDIAS
	------------------------------------ */
	function saveMedia() {
		var elements = [], annonce = $('main#annonce').attr('data-uri');
		$('#diapo-manager .media-list li').each(function() {
			elements.push({ filename : $(this).attr('data-filename'), caption : $(this).find('.media-caption input').val() });
		});
		$.ajax({
			url: BASTION.smartSubmitUrl + "?handler=order-diapo",
			data: { annonce: annonce, elements: JSON.stringify(elements)  },
			type: 'post',
			success: function(data) {
			}
		})
	}
	function updateMediaList() {
		$.ajax({
			url: BASTION.smartSubmitUrl + "?handler=get-snippet",
			data: { snippet: 'liste-media', page: $('main#annonce').attr('data-uri') },
			dataType: "html",
			type: 'GET',
			success: function(data) {
				var mediaList = $('#diapo-manager .media-list').html(data);
				mediaList.sortable({ 
					onDrop: function($item, container, _super) { 
						$item.removeClass(container.group.options.draggedClass).removeAttr("style");
						$("body").removeClass(container.group.options.bodyClass);
						saveMedia();
					} 
				});
				mediaList.find('.media-delete').click(function() {
					$.get(BASTION.smartSubmitUrl + "?handler=delete", 
						{
							type : 'file',
							file : $(this).parent('li').attr('data-filename'),
							page : $('main#annonce').attr('data-uri')
						},
						function() {
							updateMediaList();
						}
					);
				});
			}
		});
	}
	updateMediaList();
	
	$(document).on('click', '#updateMedia', function(e) {
		saveMedia();
		$.ajax({
			url: BASTION.smartSubmitUrl + "?handler=get-snippet",
			data: { snippet: 'slider', page: $('main#annonce').attr('data-uri') },
			dataType: "html",
			success: function(data) {
				$('#slider').replaceWith(data);
				initSwiper();
				$('#diapo-manager').slideUp();
				$('#slider').slideDown();
				$('#manageDiapo').show();
				console.log("success");
			},
			error: function(){},
			complete: function(){ console.log("complete") }
		});
		
	});
	
	$(document).on('click', '#manageDiapo .btn', function(e) {
		$('#manageDiapo').hide();
		$('#diapo-manager').slideDown();
		$('#slider').slideUp();
	});
	

	
	
	
	/* SLIDE
	------------------------------------ */
	
	$('.column').perfectScrollbar({ suppressScrollX: true });


	/* SHOW - HIDE > menu 
	------------------------------------ */

	$('#hide-menu, #show-menu').click(function(){
		$('#megabloc').toggleClass('showContent');
	})

});


/*!
 * jquery.unevent.js 0.2
 * https://github.com/yckart/jquery.unevent.js
 *
 * Copyright (c) 2013 Yannick Albert (http://yckart.com)
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).
 * 2013/07/26
**/
;(function ($) {
    var on = $.fn.on, timer;
    $.fn.on = function () {
        var args = Array.apply(null, arguments);
        var last = args[args.length - 1];

        if (isNaN(last) || (last === 1 && args.pop())) return on.apply(this, args);

        var delay = args.pop();
        var fn = args.pop();

        args.push(function () {
            var self = this, params = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(self, params);
            }, delay);
        });

        return on.apply(this, args);
    };
}(this.jQuery || this.Zepto));
