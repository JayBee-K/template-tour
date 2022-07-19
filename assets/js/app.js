;(function ($) {
	'use strict';
	let windowWidth = $(window).width();

	const handleTouchMoveNavigation = function (ev) {
		if (!$(ev.target).closest('#header-navigation').length) {
			ev.preventDefault();
		}
	}

	let sliderHero = () => {
		new Swiper('#slider-hero .swiper', {
			speed: 1000,
			autoplay: {
				delay: 8000,
				disableOnInteraction: false,
			},
			loop: 1,
			navigation: {
				nextEl: '#slider-hero .button-next',
				prevEl: '#slider-hero .button-prev',
			},
		});
	}

	let sliderHotDeals = () => {
		new Swiper('#slider-hotDeals .swiper', {
			spaceBetween: 15,
			speed: 1000,
			loop: !1,
			navigation: {
				nextEl: '#slider-hotDeals .button-next',
				prevEl: '#slider-hotDeals .button-prev',
			},
			breakpoints: {
				320: {
					slidesPerView: 1,
				},
				375: {
					slidesPerView: 1.5,
				},
				600: {
					slidesPerView: 2.5,
				},
				991: {
					slidesPerView: 3.5,
				},
				1499: {
					slidesPerView: 4,
				}
			}
		});
	}

	$(function () {
		sliderHero();
		sliderHotDeals();
	});

})(jQuery);