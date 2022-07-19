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

    let handleDropdownSearch = () => {
        $('.trigger-dropdown .form-control').click(function () {
            $(this).parent().find('.section-dropdown').toggleClass('is-show');
        });

        $('.section-dropdown .dropdown-item > a').click(function () {
            if ($(this).attr('data-toggle') !== 'collapse') {
                $(this).closest('.trigger-dropdown').find('.form-control').val($(this).text().trim());
                $(this).closest('.section-dropdown').removeClass('is-show')
            }
        });

        $(document).mouseup(function (e) {
            let elm = $('.section-dropdown.is-show');
            elm.is(e.target) || 0 !== elm.has(e.target).length || (
                elm.removeClass('is-show')
            )
        });
    }

    $(function () {
        sliderHero();
        sliderHotDeals();

        let initFlatpickrConfig = {
            defaultDate: [Date.now()],
            mode: "single",
            locale: "vn",
            altInput: true,
            altFormat: 'd-m-Y',
            minDate: "today",
            onOpen: function () {
                initFlatpickr.set('positionElement', $(this).find(".form-control")[0]);
                initFlatpickr.set("mode", "single");
            }
        };

        let initFlatpickr;
        $(".initFlatpickr").each(function () {
            initFlatpickr = $(this).flatpickr(initFlatpickrConfig);
        });

        handleDropdownSearch();
    });

})(jQuery);