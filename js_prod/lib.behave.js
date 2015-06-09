check_load = {};


$.fn.behave = function (behaviors) {
	var behave = {
		fit : function (element, options) {
			setup_listeners(element);
			
			function fit() {
				
				var parent = $(element).parent();
				var width = parent.width();
				var height = parent.height(); 

				var w = $(element).width();
				var h = $(element).height();
				var x = 0;
				var y = 0;

				if (w > 0 && h > 0) {
					var aspect_ratio = w/h;
	
					if (aspect_ratio > width / height) {
						w = width;
						h = width / aspect_ratio;
						if (options.align == 'center') {
							y = (height - h) / 2;
						}
					}
					else {
						h = height;
						w = height * aspect_ratio;
						if (options.align == 'center') {
							x = (width - w) / 2; 
						}
					}

					var parent_position = parent.css('position');
					if (parent_position == 'static') {
						parent.css('position', 'relative');
					}
					if (w > 0 && h > 0) {
						$(element).css({
							position : 'absolute',
							width : w,
							height : h,
							left : x,
							top : y
						});
					}
				}
				
				$(element).trigger('resize');
			}
			
			//	if is image, show loading image until actual image loads
			if ($(element).is('img')) {
				var id		= new Date().getTime();
				
				$(element).attr('onLoad', 'check_load[' + id + ']()').attr('id', 'loader-' + id);
				
				$(element).load(function () {
					if (check_load[id]) check_load[id]();
				});
				
				check_load[id] = function() {
					delete check_load[id];
					fit();
					parentChange(element, fit);
				};
			} else {
				fit();
				parentChange(element, fit);
			}
		},
		fill : function (element, options) {
			
			function vertical_height() {
				var parent = $(element).parent();
				parent_height = parent.innerHeight();
				prev_height = 0;
				next_height = 0;
				var parent_top = parent.first().offset().top;
				prev_height = $(element).offset().top - parent_top;
				var test = $('<div>');
				$(element).parent().append(test);
				next_height = test.position().top - ($(element).position().top + $(element).height());
				test.remove();
				return parent_height - prev_height - next_height;
			}

			function fill() {

				if (element == document.body) {
					$(window).one('resize', fill);
				}
				var parent = $(element).parent();

				var width = parent.width();
				var height = parent.height();

				if (options.vertical_fit) {
					height = vertical_height();
				}

				if (element == document.body) {
					width = $(window).width();
					height = $(window).height();
				}

				if (width > 0 && $(element).outerWidth() != width) {
					$(element).outerWidth(width);
				}
				if (height > 0 && $(element).outerHeight() != height) {
					$(element).outerHeight(height);
				}
			}
			parentChange(element, fill);
			fill();
		},
		fitText : function (element, options) {
			setup_listeners(element);
			
			var text = $(element).contents();

			var sizer;

			function fit() {

				if (text.text() == '') return;
				text.detach();
				var text_element = $('<div>');
				text_element.css({
                    position : 'relative',
                    display : 'inline-block'
                });
				
				if (sizer) sizer.remove();
				text_element.append(text);
				sizer = $('<div class="sizer">');
				sizer.append(text_element);
				sizer.css({
					fontSize : 12
				});
				$(element).append(sizer);
				var text_aspect_ratio = $(text_element).width() / $(text_element).height();
				var aspect_ratio = $(element).width() / $(element).height();
				if (text_aspect_ratio > aspect_ratio) {
					$(sizer).width($(text_element).width());
					$(sizer).height($(text_element).width() / aspect_ratio);
				}
				else {
					$(sizer).height($(text_element).height());
					$(sizer).width($(text_element).height() * aspect_ratio);
				}
				while (true) {
					var w = sizer.width();
					var h = sizer.height();
					sizer.width(w * 0.9);
					sizer.height(h * 0.9);
					if (sizer.width() < text_element.width() || sizer.height() < text_element.height()) {
						sizer.width(w);
						sizer.height(h);
						break;
					}
				}
				//	the sizer is now closest aspect ratio as its parent's
				var scale = $(element).width() / sizer.width();
				text_aspect_ratio = text_element.width() / text_element.height();
				sizer.css({
					'webkitTransformOrigin': '0% 0%',
					'mozTransformOrigin': '0% 0%',
					'msTransformOrigin': '0% 0%',
					'oTransformOrigin': '0% 0%',
					'transformOrigin': '0% 0%',
					'transform' : 'scale(' + scale + ', ' + scale + ')'
				});

				var top = (sizer.height() - text_element.height())/2;
				var left = (sizer.width() - text_element.width())/2;
				text_element.css({
					position: 'absolute',
					top : top,
					left : left
				})
				
				$(element).trigger('resize');
			}
			fit();
			parentChange(element, fit);
		},
		zoomable : function (element, options) {
			var scale = 1;
			var rotation = 0;
			var offset = [0, 0];
			var dragging = false;
			var pinching = false;
			var last_drag;
			var last_pinch;
			var last_scale = 1;

			$(element).css({
				'webkitTransformOrigin': '0% 0%',
				'mozTransformOrigin': '0% 0%',
				'msTransformOrigin': '0% 0%',
				'oTransformOrigin': '0% 0%',
				'transformOrigin': '0% 0%'
			});

			$(element).hammer().on('drag', function (e) {
				if (scale > 1) {
					if (last_drag == undefined) {
						last_drag = [e.gesture.deltaX, e.gesture.deltaY];
					}
					offset[0] += e.gesture.deltaX - last_drag[0];
					offset[1] += e.gesture.deltaY - last_drag[1];

					last_drag = [e.gesture.deltaX, e.gesture.deltaY];

					clamp();
					render();
				}
			});

			$(element).hammer().on('drag swipeup swipedown release', function (e) {
				if (captured) e.stopPropagation();
			});

			$(element).hammer().on('pinch', function (e) {
				if (last_pinch == undefined) {
					last_pinch = [e.gesture.deltaX, e.gesture.deltaY];
				}

				scale = scale / last_scale * e.gesture.scale;
				var growth = 1 - e.gesture.scale/last_scale;

				rotation = (rotation + e.gesture.rotation) % 360; 

				var o = $(element).offset();
				var x = (e.gesture.center.pageX - o.left);
				var y = (e.gesture.center.pageY - o.top);

				x *= growth;
				y *= growth;

				last_scale = e.gesture.scale;
			   
				var deltaX = e.gesture.deltaX - last_pinch[0] + x;
				var deltaY = e.gesture.deltaY - last_pinch[1] + y

				offset[0] += deltaX;
				offset[1] += deltaY;

				last_pinch = [e.gesture.deltaX, e.gesture.deltaY];

				clamp();
				render();
			});

			$(element).on('touchend touchcancel mouseup', function (e) {
				last_pinch = undefined;
				last_drag = undefined;
				last_scale = 1;
			});

			$(element).hammer().on('doubletap', function () {
				if (scale == 1) scale = 2
				else scale = 1;
				offset[0] = 0;
				offset[1] = 0;
				render();
			});

			$(element).hammer().on('release', function () {
				if (scale < 1) {
					scale = 1;
					offset[0] = 0;
					offset[1] = 0;
					render();
				}
			});

			var captured = false;

			$(element).on('touchstart touchmove', function (e) {
				if (e.originalEvent.touches.length > 1 || scale > 1) {
					e.originalEvent.preventDefault();
				}
				if (scale > 1.1) captured = true;
				else			 captured = false;
			});

			function clamp() {
				var w = $(element).width();
				var h = $(element).height();
				offset[0] = Math.max(-w * (scale-1), Math.min(0, offset[0]));
				offset[1] = Math.max(-h * (scale-1), Math.min(0, offset[1]));

				if (scale < 1) {
					offset[0] = w * (1 - scale) / 2;
					offset[1] = h * (1 - scale) / 2;
				}
			}

			function render() {
				var x = offset[0] / scale;
				var y = offset[1] / scale;
				
				rotation = 0;
				
				var transform3d =	'scale3d(' + scale + ', '  + scale + ',1) ' + 'translate3d(' + x + 'px,' + y + 'px,0px) rotate3d(0,0,0,' + rotation + 'deg)';
				var transform2d =	'scale(' + scale + ', '	 + scale + ') ' + 'translate(' + x + 'px,' + y + 'px) rotate(' + rotation + 'deg`)';

				$(element).css({
					'webkitTransform':	transform3d,
					'oTransform':		transform2d,
					'msTransform':		transform2d,
					'mozTransform':		transform2d,
					'transform':		transform3d
				});
			}
		}
	}

	function setup_listeners(renderer) {
		if ($(renderer).attr('has_listeners') == 'true') return false;
		$(renderer).attr('has_listeners', 'true');
		
		var is_rendered = false;
		var last_render = new Date().getTime();
		var loader		= $('#templates .spinner-mini').clone();
		
		$(renderer).on('unready', function () {
			$(renderer).css('opacity', '0');
			
			if ($(renderer).parent().prop("tagName") !== 'BODY')
				$(renderer).parent().append(loader);
		});
		
		$(renderer).trigger('unready');
		
		$(renderer).on('resize', function() { 
			last_render = new Date().getTime();
			is_rendered = false;
			
			setTimeout(function() {
				if ((new Date().getTime() - last_render) < 300) return false;
				if (is_rendered == true) return false;

				is_rendered = true;
				$(renderer).trigger('rendered');
			}, 400);
		});
		
		$(renderer).on('rendered', function () {
			$(renderer).css('opacity', '1');
			loader.fadeOut('fast').remove();
		});
	}
	
	function parentChange(element, fn) {
		var parent = $(element).parent();
		
		//	listen to window change if element is body
		var width	= parent.width();
		var height	= parent.height();
 		
 		function trigger() {
			if (parent[0]) {
				$(element).trigger('resize');
				width = parent.width();
				height = parent.height();
				fn();
			}
		}
		
		setInterval(function () {
			var element_still_exists = $.contains(document, $(element)[0]);
			
			if (!element_still_exists) return false;
			
			var new_parent = $(element).parent();
			if (parent[0] != new_parent[0] || (new_parent[0] == undefined && parent[0] == undefined)) {
				parent = new_parent;
				trigger();
			}
			else if (parent.width() != width)	trigger();
			else if (parent.height() != height) trigger();
		}, 250);
	}

	this.each(function (index, element) {
		for (var behavior in behaviors) {
			if (behave[behavior]) {
				behave[behavior](element, behaviors[behavior]);
			}
		}
	});
}
