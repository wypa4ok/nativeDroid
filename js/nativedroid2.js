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

							$("body").find(".ui-flipswitch-on").removeClass("waves-effect");
							Waves.attach('.ui-flipswitch',['waves-button','waves-light']);

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

// nd2Toast
	(function ($) {
	    $.nd2Toast = function (options) {

							var _self = this;

			        _self.defaults = {
									message : "",
									action : {
										link : null,
										title : null,
										fn : null,
										color : "lime"
									},
								ttl : 3000
							};

							_self.isClosed = false;

							_self.toastId = null;

	            _self.options = $.extend(_self.defaults, options);

							_self.getToast = function() {
								return $("body").find("#"+_self.toastId);
							};

							_self.hasPendingToasts = function() {
								return ($("body").find(".nd2-toast").length > 0);
							};

							_self.getOtherToast = function() {
								return $("body").find(".nd2-toast");
							}

							_self.hasAction = function() {
								return (_self.options.action.title &&
										(_self.options.action.link || _self.options.action.fn));
							};

							_self.getAction = function() {
								return (_self.hasAction()) ? "<span class='nd2-toast-action'><a href='#toastAction' class='ui-btn ui-btn-inline clr-btn-accent-"+_self.options.action.color+"'>"+_self.options.action.title+"</a></span>" : "";
							};

							_self.getMessage = function() {
									return "<span class='nd2-toast-message'>"+_self.options.message+"</span>";
							};

							_self.generateId = function() {
								_self.toastId = "toast" + Math.random().toString(16).slice(2);
							};

							_self.create = function() {

								if(!_self.hasPendingToasts()) {

									_self.generateId();

									var hasActionClass = (!_self.hasAction()) ? "no-action" : "";
									var toast = "<div id='"+_self.toastId+"' class='nd2-toast nd2-toast-off "+hasActionClass+"'><div class='nd2-toast-wrapper'>"
																	+_self.getMessage()
																	+_self.getAction()
																	+"</div></div>";

									$("body").append(toast);

									window.setTimeout(function() {
										_self.bindAction();
										_self.show();
									},50);

								} else {
									window.setTimeout(function() {
										_self.abortOtherToasts();
									},100);
								}
						};

							_self.bindAction = function() {
								if(_self.hasAction()) {

									var toast = _self.getToast();
									var hasLink = (_self.options.action.link);
									var hasEvent = (_self.options.action.fn && typeof _self.options.action.fn === "function");

									toast.find(".nd2-toast-action a").on("click",function() {
											if(hasEvent) { _self.options.action.fn(); }
											if(hasLink) { $("body").pagecontainer("change",_self.options.action.link); }
											_self.hide();
									});

								}
							};

							_self.show = function() {
								var toast = _self.getToast();
								toast.removeClass("nd2-toast-off");

								$("body").addClass("nd2-toast-open");

								window.setTimeout(function() {
									_self.hide();
								},_self.options.ttl);

							};

							_self.hide = function() {
								if(_self.isClosed) return;

								_self.isClosed = true;

								var toast = _self.getToast();
								if(toast.length > 0) {

									toast.addClass("nd2-toast-off");

									if(_self.hasPendingToasts()) {
										$("body").removeClass("nd2-toast-open");
									}

									window.setTimeout(function() {
										_self.destroyToast();
									},400);
								}

							};

							_self.destroyToast = function() {
								var toast = _self.getToast();
								toast.remove();
							};

							_self.abortOtherToasts = function() {

								if(_self.hasPendingToasts()) {

									var toast = _self.getOtherToast();
									if(toast) {

										toast.addClass("nd2-toast-off");

										$("body").removeClass("nd2-toast-open");

										window.setTimeout(function() {

												toast.remove();
												_self.create();

										},400);

									}

								}

							};

							_self.create();

	    }

			$("body").on("click","[data-role='toast']",function(e) {
				e.preventDefault();
				var options = {
					action: {}
				};

				if($(this).data('toast-message')) { options.message = $(this).data('toast-message'); }
				if($(this).data('toast-ttl')) { options.ttl = $(this).data('toast-ttl'); }
				if($(this).data('toast-action-title')) { options.action.title = $(this).data('toast-action-title'); }
				if($(this).data('toast-action-link')) { options.action.link = $(this).data('toast-action-link'); }
				if($(this).data('toast-action-color')) { options.action.color = $(this).data('toast-action-color'); }

				new $.nd2Toast(options);

			})

	}(jQuery));



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

			$("body").find(".ui-flipswitch-on").removeClass("waves-effect");
			Waves.attach('.ui-flipswitch',['waves-button','waves-light']);

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
