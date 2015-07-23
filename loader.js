var your_bookmarklet = (function() {

		// some things we need in here
		var host = 'https://cdn.rawgit.com/mpkliewer/iframe-bookmarklet-xapi/master/',
				iframe_url = host + 'xapi-bookmarklet.html',
				$ = false,
				doc = document,
				head = doc.getElementsByTagName('head')[0],
				body = doc.getElementsByTagName('body')[0],
				messageListeners = [],
				iframe;

		// general utils
		var Utils = {

				// load a javascript file
				loadJs: function(src) {
						var js = doc.createElement('script');
						js.type = 'text/javascript';
						js.src = src;
						js.async = true;
						head.appendChild(js);
				},

				addMessageListener: function(message, callback) {
						messageListeners[message] = callback;
				},

				// if jquery does not exist, load it
				// and callback when jquery is loaded
				loadJquery: function(cb) {
						// always load jquery because they might have
						// a prototyped version on page
						Utils.loadJs(host + 'js/jquery-2.1.3.min.js');
						// start checking every 100ms to see
						// if the jQuery object exists yet
						(function poll() {
								setTimeout(function() {
										// jquery exists, callback
										if(window.jQuery) {
												$ = window.jQuery;
												cb();
										// jquery doesn't exist,
										// keep trying
										} else {
												poll();
										}
								}, 100);
						})();
				}

		}

		var Bookmarklet = {

				hide: function() {
						iframe.fadeOut('fast');
				},

				show: function(dimensions) {
						if(dimensions) {
								iframe.css(dimensions);
						}
						if(!iframe.is(':visible')) {
								iframe.fadeIn('fast');
						}
				},

				// this is accessed by itself
				// when it wants to create a new one
				reset: init

		}

		window.addEventListener('message', function(e) {
				var data = e.data;
				// the window is trying to execute
				// some arbitrary custom event
				if(!!data.event) {
						messageListeners[data.event](data.args);
				}
		}, false);

		// listen for calls from iframe
		Utils.addMessageListener('unload-bookmarklet', function() {
				Bookmarklet.hide();
		});

		Utils.addMessageListener('resize-iframe', function(dimensions) {
				Bookmarklet.show(dimensions);
		});

		// creates a way to proxy
		// POST methods to the website directly
		var Channel = function(path) {

				if(iframe) {
						iframe.remove();
						iframe = false;
				}

				iframe = createIframe(path);

				var c = this,
						cw = iframe[0].contentWindow;

				// provide a way for bookmarklet
				// to trigger custom events in iframe
				this.trigger = function(event, args) {
						cw.postMessage({
								event: event,
								args: args
						}, '*');
				}

				// generate the iframe to proxy
				function createIframe(url) {
						var i = $('<iframe />')
								.attr('src', url)
								.appendTo(body);
						return i;
				}

				return this;

		}

		function init() {

				// load jquery
				Utils.loadJquery(function() {

						// when jquery is loaded,
						// create bookmarklet channel
						new Channel(iframe_url);

				});

				return this;

		};

		init();

		return Bookmarklet;

})();
