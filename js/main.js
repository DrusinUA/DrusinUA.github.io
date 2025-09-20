	jQuery(document).ready(function ($) {
		AOS.init();

	$('.home').on('click', function (e) {
		e.preventDefault();
		var path = window.location.pathname || '';
		var isInPages = path.toLowerCase().indexOf('/pages/') !== -1;
		var target = isInPages ? '../index.html' : './index.html';
		window.location.href = target;
	});

		$(".button-container a[href^='#']").on("click", function (e) {
			e.preventDefault();
			const href = $(this).attr("href");
			var $target = $(href);
			if ($target.length) {
				$("html, body").animate({ scrollTop: $target.offset().top - 100 }, 800);
			}
		});

		// Copy email in footer (prevent navigation even if it's an anchor)
		$(document).on('click', '.copy-email', function (e) {
			e.preventDefault();
			var email = $(this).data('email') || 'andriy@restlesscorp.com';
			if (navigator.clipboard && navigator.clipboard.writeText) {
				navigator.clipboard.writeText(email);
			} else {
				var $tmp = $('<input>');
				$('body').append($tmp);
				$tmp.val(email).select();
				document.execCommand('copy');
				$tmp.remove();
			}
		});

	scrollSpy('header', {
		sectionSelector: 'section',
		targetSelector: 'a',
		offset: 300,
		hrefAttribute: 'href',
		activeClass: 'active-href',
	});
});



(function () {
	// Init
    var container = document.getElementById("container"),
        inner = document.getElementById("inner");

	// Mouse
	var mouse = {
		_x: 0,
		_y: 0,
		x: 0,
		y: 0,
		updatePosition: function (event) {
			var e = event || window.event;
			this.x = e.clientX - this._x;
			this.y = (e.clientY - this._y) * -1;
		},
        setOrigin: function (el) {
            // Use viewport-based coordinates so margins/positioning don't skew the pivot
            var rect = el.getBoundingClientRect();
            this._x = Math.floor(rect.left + rect.width / 2);
            this._y = Math.floor(rect.top + rect.height / 2);
        },
		show: function () {
			return "(" + this.x + ", " + this.y + ")";
		}
	};

    // Track the mouse position relative to the visual card (#inner) center
    // so rotations pivot correctly even if layout shifts left/right.
    var syncOrigin = function(){
        if (inner) { mouse.setOrigin(inner); }
    };
    syncOrigin();

	//-----------------------------------------

	var counter = 0;
    var updateRate = 10;
	var isTimeToUpdate = function () {
		return counter++ % updateRate === 0;
	};

	//-----------------------------------------

	var onMouseEnterHandler = function (event) {
		update(event);
	};

	var onMouseLeaveHandler = function () {
		inner.style = "";
	};

	var onMouseMoveHandler = function (event) {
		if (isTimeToUpdate()) {
			update(event);
		}
	};

	//-----------------------------------------

    var update = function (event) {
        mouse.updatePosition(event);
        // Subtle tilt: normalize pointer offset to [-1,1] then scale to small degrees
        var nx = mouse.x / (inner.offsetWidth  / 2);
        var ny = mouse.y / (inner.offsetHeight / 2);
        // Clamp
        nx = Math.max(-1, Math.min(1, nx));
        ny = Math.max(-1, Math.min(1, ny));
        // Very small max rotation
        var MAX_DEG = 0.8; // subtle
        updateTransformStyle((ny * MAX_DEG).toFixed(3), (nx * MAX_DEG).toFixed(3));
    };

    var updateTransformStyle = function (x, y) {
        var style = "rotateX(" + x + "deg) rotateY(" + y + "deg)";
        inner.style.transform = style;
        inner.style.webkitTransform = style;
        inner.style.mozTransform = style;
        inner.style.msTransform = style;
        inner.style.oTransform = style;
    };

	//-----------------------------------------

    // Enable tilt only for precise pointers and desktop-ish widths
    var enableTilt = window.matchMedia ? window.matchMedia('(pointer: fine)').matches : true;
    if (enableTilt && container && inner) {
        container.onmouseenter = onMouseEnterHandler;
        container.onmouseleave = onMouseLeaveHandler;
        container.onmousemove = onMouseMoveHandler;
    }
    // Recompute the origin on resize/scroll as layout changes
    window.addEventListener('resize', syncOrigin);
    window.addEventListener('scroll', syncOrigin, { passive: true });
})();
