// ND2 Project Settings


var nd2Project = {
	stats : {
		analyticsUA: null // Your UA-Code for Example: 'UA-123456-78'
	},
	advertising : {
		active : false, // true | false
		path : "/examples/fragments/adsense/",
		extension : ".html"
	}
};


//
// ...the magic starts here...
//
/////////////////////////////////


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


	// nd2-ad
	$.widget("nd2.ad",{
		options: {
			banner : null,
			path : nd2Project.advertising.path,
			activated : nd2Project.advertising.active,
			extension : nd2Project.advertising.extension,
			post : {}
		},
		_create: function() {
			var el = this.element;
			var opts = $.extend(this.options, el.data("options"));
			$(document).trigger("createinclude");
			
			if(opts.activated && opts.banner !== null) {
				var src = opts.path+opts.banner+opts.extension;
				el.addClass("nd2-banner");
				el.load(src,opts.post,function() {
					el.enhanceWithin();
				});
			}
		},
		_update: function() {
//			console.log("update?");
		},
		refresh: function() {
			return this._update();
		}
	});

	$(document).bind("pagecreate", function(e) {
		$(document).trigger("includebeforecreate");
		return $("nd2-ad", e.target).ad();
	});


})(jQuery);



// Basics

$(function() {

	// Open navigation by Swipe
	$(".ui-page:not('.nd2-no-menu-swipe')").on("swiperight swipeleft",function(e) {
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
	
	// Google Analytics Helper
	
	function getUrlParts(url) {
	    var a = document.createElement('a');
	    a.href = url;
	
	    return {
	        href: a.href,
	        host: a.host,
	        hostname: a.hostname,
	        port: a.port,
	        pathname: a.pathname,
	        protocol: a.protocol,
	        hash: a.hash,
	        search: a.search
	    };
	}
	
	var _ga = {
		send : function(url) {
		  (!url) ? ga('send', 'pageview') : ga('send', 'pageview', url);
		}
	};
	
	if(nd2Project.stats.analyticsUA) {
	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	
	  ga('create', nd2Project.stats.analyticsUA, 'auto');
		_ga.send(null);
		
		// Trigger Page Change
		
		$("body").on("pagechange",function(evt,data) {
			_ga.send(getUrlParts(data.options.absUrl).pathname);
		});
		
	}
	
});

// Magic ends.
///////////////