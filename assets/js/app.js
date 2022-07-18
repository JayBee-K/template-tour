;(function ($) {
	'use strict';
	let windowWidth = $(window).width();

	const handleTouchMoveNavigation = function (ev) {
		if (!$(ev.target).closest('#header-navigation').length) {
			ev.preventDefault();
		}
	}

	$(function () {
	});

})(jQuery);