// ND2 Widgets
(function($){
	
	$.widget("nd2.gallery",{
		options: {
			count : 15,
			delay : 100,
			duration : 400,
			cols : 5
		},
		_create: function() {
			var el = this.element;
			var opts = $.extend(this.options, el.data("options"));
			$(document).trigger("creategallery");
			var _html = "";
			for(var i = 1; i <= opts.count; i++) {
				var calcDelay = (Math.round(i*(opts.delay / 1000)*10) / 10);
				_delay = (calcDelay > 2) ? (i % 5 / 10) : calcDelay;
				_html += "<div class='dummybox wow zoomIn' data-wow-duration='"+opts.duration+"' data-wow-delay='"+_delay+"s'>"+i+"</div>";
			}
			el.html(_html);
		},
		_update: function() {

		},
		refresh: function() {
			return this._update();
		}
	});

	$(document).bind("pagecreate", function(e) {
		$(document).trigger("gallerybeforecreate");
		return $("nd2-gallery", e.target).gallery();
	});

	// nd2-include
	$.widget("nd2.include",{
		options: {
			src : null,
			post : {}
		},
		_create: function() {
			var el = this.element;
			var opts = $.extend(this.options, el.data("options"));
			$(document).trigger("createinclude");
			
			if(opts.src !== null) {
				el.load(opts.src,opts.post,function() {
					el.enhanceWithin();
					
					// Apply waves.js
					if(typeof Waves !== "undefined") {
					    Waves.attach('a', ['waves-button']);
					    Waves.attach('button', ['waves-button']);
					    Waves.init();
					}
					
				});
			}
		},
		_update: function() {
			console.log("update?");
		},
		refresh: function() {
			return this._update();
		}
	});

	$(document).bind("pagecreate", function(e) {
		$(document).trigger("includebeforecreate");
		return $("nd2-include", e.target).include();
	});

})(jQuery);



// Basics

$(function() {

	$(document).on("swiperight swipeleft",function(e) {
		if($(".ui-page-active").jqmData("panel") !== "open") {
			if(e.type === "swiperight") {
				$(".ui-panel.ui-panel-position-left:first").panel("open");
			}
		}
	});

	// WOW.JS
	if(typeof WOW !== "undefined") {
		new WOW().init();
	}
	
	// Waves.js
	if(typeof Waves !== "undefined") {
	    Waves.attach('a', ['waves-button']);
	    Waves.attach('button', ['waves-button']);
	    Waves.init();
	}
	
	// show body
	$("body").addClass("nd2-ready");
	$(document).on("pagechange",function(){
		$("body").removeClass("nd2-ready");
	});
	
});
