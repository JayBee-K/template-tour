let windowWidth = $(window).width();

const handleTouchMoveNavigation = function (ev) {
    if (!$(ev.target).closest('#header-navigation').length) {
        ev.preventDefault();
    }
}

const handleHeaderMobile = () => {
    if (windowWidth < 992) {
        let elmBody = $('body'),
            elmHamburger = $('#header-hamburger'),
            elmNavigation = $('#header-navigation'),
            elmOverlay = $('#header-overlay'),
            elmCloseNavigation = $('#header-navigation_close');

        elmNavigation.find('ul > li > ul > li').map(function (index) {
            $(this).parent().prev('a').attr({
                'data-toggle': 'collapse',
                'data-target': "#header-sub_" + index,
            });
            $(this).parent().attr({
                "id": "header-sub_" + index,
                "class": "navigation-sub collapse",
                "data-parent": "#header-navigation"
            });
        });

        elmHamburger.click(function () {
            if (elmBody.hasClass('is-show_navigation')) {
                elmBody.attr({
                    'class': '',
                    'style': ''
                });
                document.removeEventListener('touchmove', handleTouchMoveNavigation);
                elmNavigation.find('.collapse').collapse('hide');
            } else {
                document.addEventListener('touchmove', handleTouchMoveNavigation, {passive: false});
                elmBody.attr({
                    'class': 'is-show_navigation',
                    'style': 'overflow-y: hidden'
                });
            }
        });

        elmOverlay.add(elmCloseNavigation).click(() => {
            elmHamburger.trigger('click')
        });
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
    handleHeaderMobile();
    sliderHero();
    sliderHotDeals();

    // Địa điểm - Đi & đến
    $('.flight-select').each(function () {
        dropdownParent = $(this).parents('.inner');
        $(this).select2({
            dropdownParent: dropdownParent,
            placeholder: "Chọn địa điểm",
            templateResult: styleSelect,
            width: '100%',
        });
    });

    function styleSelect(attrElm) {
        if (!attrElm.id) {
            return attrElm.text;
        }
        let html = $(`<div class="d-flex align-items-center">
                        <div class="sel-icon">
                            <i class="fal ${attrElm.title.split("|")[3]} mb-0 h6"></i>
                        </div>
                        <div class="sel-content">
                            <div class="sel-title font-weight-bold">${attrElm.title.split("|")[0]}</div>
                            <div class="text-muted sel-subtitle">${attrElm.title.split("|")[1]}</div>
                        </div>
	                    <div class="sel-code text-right">
	                        ${attrElm.title.split("|")[2]}
	                    </div>
                    </div>`);

        return html;
    }

    const altFormat = "d-m-Y";
    /***
     *
     * Chuyến bay
     */
    const departureFlatpickrConfig = {
        defaultDate: [Date.now()],
        mode: "single",
        locale: "vn",
        altInput: true,
        altFormat: altFormat,
        showMonths: 2,
        minDate: "today",
        onOpen: function (selectedDates, dateStr, instance) {
            dateDeparture.set('positionElement', $("#date-departure")[0]);
            dateDeparture.set("mode", "single");
        },
    };
    const returnFlatpickrConfig = {
        defaultDate: [Date.now()],
        mode: "single",
        locale: "vn",
        altInput: true,
        altFormat: altFormat,
        showMonths: 2,
        minDate: "today",
        onOpen: function (selectedDates, dateStr, instance) {
            dateDeparture.set('positionElement', $("#date-return")[0]);
            dateReturn.set("mode", "single");
        },
        onChange: function (selectedDates, dateStr, instance) {
            const [departure_val, return_val] = selectedDates;
            if (return_val) {
                const checkOutDate = flatpickr.formatDate(return_val, altFormat);
            }
        },
    };

    dateDeparture = $("#date-departure").flatpickr(departureFlatpickrConfig);

    let htmlRender = '';
    let dateReturn = '';
    $('input[name="choose-flight_chuyenbay"]').change(function (e) {
        if ($('#choose-flight-02:checked').length > 0) {
            htmlRender = `<div class="col col-custom" id="col-mark_chuyenbay__return">
							<div class="inner position-relative trigger-flat_chuyenbay" data-calendar="2">
								<label  for="">Ngày trở về</label>
								<div class="d-flex align-items-center box-inner">
									<i class="fad fa-calendar-alt"></i>
									<input type="text" placeholder="Departure Date"
									       class="border-0 rounded-0 py-0 bg-transparent form-control form-date flatpickr flatpickr-input"
									       id="date-return"/>
								</div>
							</div>
						</div>`;

            $('#col-mark_chuyenbay').after(htmlRender);
            dateReturn = $("#date-return").flatpickr(returnFlatpickrConfig);
        } else {
            htmlRender = ``;
            $('#col-mark_chuyenbay__return').remove();
        }
    });

    $(document).on('click', '.trigger-flat_chuyenbay', function () {
        if ($(this).data('calendar') == 1)
            dateDeparture.open();
        else
            dateReturn.open();
    });

    addEventCounterActions(
        ".passenger-event_chuyenbay",
        ".value-count-baby_chuyenbay",
        "#total-people_chuyenbay",
        plusCounterHandle,
        minusCounterHandle
    );

    function checkMaxPeople(
        inputCounterElement,
        count,
        countBaby,
        totalCount,
        maxPeople,
        maxBaby
    ) {
        if (
            (inputCounterElement.hasClass("value-count-baby_chuyenbay") && count >= maxBaby) ||
            (!inputCounterElement.hasClass("value-count-baby_chuyenbay") &&
                totalCount - countBaby >= maxPeople)
        ) {
            return true;
        }

        return false;
    }

    function plusCounterHandle(
        inputCounterElement,
        htmlCounterElement,
        plusCounterElement,
        minusCounterElement,
        counterBabyElement,
        totalCounterElement
    ) {
        let count = inputCounterElement.val();
        let countBaby = counterBabyElement.val();
        let countText = htmlCounterElement.html();
        let totalCount = totalCounterElement.html();
        totalCount = Number(totalCount);
        count = Number(count);
        countBaby = Number(countBaby);

        if (
            checkMaxPeople(inputCounterElement, count, countBaby, totalCount, 9, 4)
        ) {
            return;
        }

        totalCount += 1;
        count += 1;
        countText = count;

        minusCounterElement.removeClass("disabled");

        inputCounterElement.val(count);
        htmlCounterElement.html(countText);
        totalCounterElement.html(totalCount);

        if (
            checkMaxPeople(inputCounterElement, count, countBaby, totalCount, 9, 4)
        ) {
            plusCounterElement.addClass("disabled");
        }
    }

    function minusCounterHandle(
        inputCounterElement,
        htmlCounterElement,
        plusCounterElement,
        minusCounterElement,
        counterBabyElement,
        totalCounterElement
    ) {
        let count = inputCounterElement.val();
        let countBaby = counterBabyElement.val();
        let countText = htmlCounterElement.html();
        let totalCount = totalCounterElement.html();
        totalCount = Number(totalCount);
        count = Number(count);
        countBaby = Number(countBaby);

        if (count <= 0 || totalCount <= 1) {
            return;
        }

        if (
            checkMaxPeople(inputCounterElement, count, countBaby, totalCount, 9, 4)
        ) {
            plusCounterElement.removeClass("disabled");
        }

        count -= 1;
        countText = count;
        totalCount -= 1;

        inputCounterElement.val(count);
        htmlCounterElement.html(countText);
        totalCounterElement.html(totalCount);

        if (count <= 0) {
            minusCounterElement.addClass("disabled");
        }
    }

    function prepareCounterElements(
        parentCounterElement,
        counterBabyElement,
        totalCounterElement,
        handleCounter
    ) {
        const inputCounterElement = parentCounterElement.find(
            ".value-passenger-counter_chuyenbay"
        );
        const htmlCounterElement = parentCounterElement.find(
            ".passenger-counter_chuyenbay"
        );

        const minusCounterElement = parentCounterElement.find(
            ".passenger-minus_chuyenbay"
        );

        const plusCounterElement = parentCounterElement.find(
            ".passenger-plus_chuyenbay"
        );

        return handleCounter(
            inputCounterElement,
            htmlCounterElement,
            plusCounterElement,
            minusCounterElement,
            counterBabyElement,
            totalCounterElement
        );
    }

    function addEventCounterActions(
        counterClass,
        counterBabyClass,
        totalCounterId,
        plusCounterHandle,
        minusCounterHandle
    ) {
        const totalCounterElement = $(totalCounterId);
        $(counterClass).on("click", ".passenger-plus_chuyenbay", function () {
            const parentCounterElement = $(this).parents(counterClass);
            const counterBabyElement = parentCounterElement
                .parents(".passenger-dropdown-container")
                .find(counterBabyClass);
            prepareCounterElements(
                parentCounterElement,
                counterBabyElement,
                totalCounterElement,
                plusCounterHandle
            );
        });
        $(counterClass).on("click", ".passenger-minus_chuyenbay", function () {
            const parentCounterElement = $(this).parents(counterClass);
            const counterBabyElement = parentCounterElement
                .parents(".passenger-dropdown-container")
                .find(counterBabyClass);
            prepareCounterElements(
                parentCounterElement,
                counterBabyElement,
                totalCounterElement,
                minusCounterHandle
            );
        });
    }

    /***
     * End Chuyến bay
     */

    /***
     * Vé đoàn
     */

    const departureVeDoanFlatpickrConfig = {
        defaultDate: [Date.now()],
        mode: "single",
        locale: "vn",
        altInput: true,
        altFormat: altFormat,
        showMonths: 2,
        minDate: "today",
        onOpen: function (selectedDates, dateStr, instance) {
            dateDeparture.set('positionElement', $("#date-departure_vedoan")[0]);
            dateDeparture.set("mode", "single");
        },
    };
    const returnVeDoanFlatpickrConfig = {
        defaultDate: [Date.now()],
        mode: "single",
        locale: "vn",
        altInput: true,
        altFormat: altFormat,
        showMonths: 2,
        minDate: "today",
        onOpen: function (selectedDates, dateStr, instance) {
            dateDeparture.set('positionElement', $("#date-return_vedoan")[0]);
            dateReturn.set("mode", "single");
        },
        onChange: function (selectedDates, dateStr, instance) {
            const [departure_val, return_val] = selectedDates;
            if (return_val) {
                const checkOutDate = flatpickr.formatDate(return_val, altFormat);
            }
        },
    };

    dateVeDoanDeparture = $("#date-departure_vedoan").flatpickr(departureFlatpickrConfig);

    let htmlRenderVeDoan = '';
    let dateReturnVeDoan = '';
    $('input[name="choose-flight_vedoan"]').change(function (e) {
        if ($('#choose-flight_vedoan-02:checked').length > 0) {
            htmlRenderVeDoan = `<div class="col" id="col-mark_vedoan__return">
							<div class="inner position-relative trigger-flat_vedoan" data-calendar="2">
								<label  for="">Ngày trở về</label>
								<div class="d-flex align-items-center box-inner">
									<i class="fad fa-calendar-alt"></i>
									<input type="text" placeholder="Departure Date"
									       class="border-0 rounded-0 py-0 bg-transparent form-control form-date flatpickr flatpickr-input"
									       id="date-return_vedoan"/>
								</div>
							</div>
						</div>`;

            $('#col-mark_vedoan').after(htmlRenderVeDoan);
            dateReturnVeDoan = $("#date-return_vedoan").flatpickr(returnFlatpickrConfig);
        } else {
            htmlRenderVeDoan = ``;
            $('#col-mark_vedoan__return').remove();
        }
    });

    $(document).on('click', '.trigger-flat_vedoan', function () {
        if ($(this).data('calendar') == 1)
            dateVeDoanDeparture.open();
        else
            dateReturnVeDoan.open();
    });

    addEventCounterActionsVeDoan(
        ".passenger-event_vedoan",
        ".value-count-baby_vedoan",
        "#total-people_vedoan",
        plusCounterHandleVeDoan,
        minusCounterHandleVeDoan
    );

    function checkMaxPeopleVeDoan(
        inputCounterElementVeDoan,
        countVeDoan,
        countBabyVeDoan,
        totalCountVeDoan,
        maxPeopleVeDoan,
        maxBabyVeDoan
    ) {
        if (
            (inputCounterElementVeDoan.hasClass("value-count-baby_vedoan") && countVeDoan >= maxBabyVeDoan) ||
            (!inputCounterElementVeDoan.hasClass("value-count-baby_vedoan") &&
                totalCountVeDoan - countBabyVeDoan >= maxPeopleVeDoan)
        ) {
            return true;
        }

        return false;
    }

    function plusCounterHandleVeDoan(
        inputCounterElementVeDoan,
        htmlCounterElementVeDoan,
        plusCounterElementVeDoan,
        minusCounterElementVeDoan,
        counterBabyElementVeDoan,
        totalCounterElementVeDoan
    ) {
        let countVeDoan = inputCounterElementVeDoan.val();
        let countBabyVeDoan = counterBabyElementVeDoan.val();
        let countTextVeDoan = htmlCounterElementVeDoan.html();
        let totalCountVeDoan = totalCounterElementVeDoan.html();
        totalCountVeDoan = Number(totalCountVeDoan);
        countVeDoan = Number(countVeDoan);
        countBabyVeDoan = Number(countBabyVeDoan);

        if (
            checkMaxPeopleVeDoan(inputCounterElementVeDoan, countVeDoan, countBabyVeDoan, totalCountVeDoan, 9, 4)
        ) {
            return;
        }

        totalCountVeDoan += 1;
        countVeDoan += 1;
        countTextVeDoan = countVeDoan;

        minusCounterElementVeDoan.removeClass("disabled");

        inputCounterElementVeDoan.val(countVeDoan);
        htmlCounterElementVeDoan.html(countTextVeDoan);
        totalCounterElementVeDoan.html(totalCountVeDoan);

        if (
            checkMaxPeopleVeDoan(inputCounterElementVeDoan, countVeDoan, countBabyVeDoan, totalCountVeDoan, 9, 4)
        ) {
            plusCounterElementVeDoan.addClass("disabled");
        }
    }

    function minusCounterHandleVeDoan(
        inputCounterElementVeDoan,
        htmlCounterElementVeDoan,
        plusCounterElementVeDoan,
        minusCounterElementVeDoan,
        counterBabyElementVeDoan,
        totalCounterElementVeDoan
    ) {
        let countVeDoan = inputCounterElementVeDoan.val();
        let countBabyVeDoan = counterBabyElementVeDoan.val();
        let countTextVeDoan = htmlCounterElementVeDoan.html();
        let totalCountVeDoan = totalCounterElementVeDoan.html();
        totalCountVeDoan = Number(totalCountVeDoan);
        countVeDoan = Number(countVeDoan);
        countBabyVeDoan = Number(countBabyVeDoan);

        if (countVeDoan <= 0 || totalCountVeDoan <= 1) {
            return;
        }

        if (
            checkMaxPeopleVeDoan(inputCounterElementVeDoan, countVeDoan, countBabyVeDoan, totalCountVeDoan, 9, 4)
        ) {
            plusCounterElementVeDoan.removeClass("disabled");
        }

        countVeDoan -= 1;
        countTextVeDoan = countVeDoan;
        totalCountVeDoan -= 1;

        inputCounterElementVeDoan.val(countVeDoan);
        htmlCounterElementVeDoan.html(countTextVeDoan);
        totalCounterElementVeDoan.html(totalCountVeDoan);

        if (countVeDoan <= 0) {
            minusCounterElementVeDoan.addClass("disabled");
        }
    }

    function prepareCounterElementsVeDoan(
        parentCounterElementVeDoan,
        counterBabyElementVeDoan,
        totalCounterElementVeDoan,
        handleCounterVeDoan
    ) {
        const inputCounterElementVeDoan = parentCounterElementVeDoan.find(
            ".value-passenger-counter_vedoan"
        );
        const htmlCounterElementVeDoan = parentCounterElementVeDoan.find(
            ".passenger-counter_vedoan"
        );

        const minusCounterElementVeDoan = parentCounterElementVeDoan.find(
            ".passenger-minus_vedoan"
        );

        const plusCounterElementVeDoan = parentCounterElementVeDoan.find(
            ".passenger-plus_vedoan"
        );

        return handleCounterVeDoan(
            inputCounterElementVeDoan,
            htmlCounterElementVeDoan,
            plusCounterElementVeDoan,
            minusCounterElementVeDoan,
            counterBabyElementVeDoan,
            totalCounterElementVeDoan
        );
    }

    function addEventCounterActionsVeDoan(
        counterClassVeDoan,
        counterBabyClassVeDoan,
        totalCounterIdVeDoan,
        plusCounterHandleVeDoan,
        minusCounterHandleVeDoan
    ) {
        const totalCounterElementVeDoan = $(totalCounterIdVeDoan);
        $(counterClassVeDoan).on("click", ".passenger-plus_vedoan", function () {
            const parentCounterElementVeDoan = $(this).parents(counterClassVeDoan);
            const counterBabyElementVeDoan = parentCounterElementVeDoan
                .parents(".passenger-dropdown-container")
                .find(counterBabyClassVeDoan);
            prepareCounterElementsVeDoan(
                parentCounterElementVeDoan,
                counterBabyElementVeDoan,
                totalCounterElementVeDoan,
                plusCounterHandleVeDoan
            );
        });
        $(counterClassVeDoan).on("click", ".passenger-minus_vedoan", function () {
            const parentCounterElementVeDoan = $(this).parents(counterClassVeDoan);
            const counterBabyElementVeDoan = parentCounterElementVeDoan
                .parents(".passenger-dropdown-container")
                .find(counterBabyClassVeDoan);
            prepareCounterElementsVeDoan(
                parentCounterElementVeDoan,
                counterBabyElementVeDoan,
                totalCounterElementVeDoan,
                minusCounterHandleVeDoan
            );
        });
    }

    /***
     * End Vé đoàn
     */

    $(".passenger-dropdown").click(function () {
        $(".passenger-dropdown-content").fadeIn();
    });

    $(".passenger-close").click(function (e) {
        e.stopPropagation();
        $(".passenger-dropdown-content").fadeOut();
    });

    $(document).on("mouseup", function (e) {
        var o = $(".form-choose-people");
        o.is(e.target) || 0 !== o.has(e.target).length || (
            $(".passenger-dropdown .passenger-dropdown-content").fadeOut())
    });

    $('.trigger-select').on("click", function () {
        $(this).find('.box-inner select').select2('open');
    });


    $(document).on('click', '.callSort', function () {
        callSort($(this));
    });

    function callSort(elm) {
        if (elm.next('.dropdown-sort').hasClass('sort-show'))
            elm.next('.dropdown-sort').removeClass('sort-show');
        else
            elm.next('.dropdown-sort').addClass('sort-show');
    }

    $(document).on("mouseup", function (e) {
        var o = $(".flight-sort");
        o.is(e.target) || 0 !== o.has(e.target).length || (
            $(".flight-sort .dropdown-sort").removeClass("sort-show"))
    });


    $(document).on('click', '.callFilter', function () {
        callFilter($(this));
    });

    function callFilter(elm) {
        if (elm.next('.dropdown-filter').hasClass('filter-show'))
            elm.next('.dropdown-filter').removeClass('filter-show');
        else {
            $(".flight-filter .item .dropdown-filter").removeClass("filter-show");
            elm.next('.dropdown-filter').addClass('filter-show');
        }
    }

    $(document).on("mouseup", function (e) {
        var o = $(".flight-filter .item");
        o.is(e.target) || 0 !== o.has(e.target).length || (
            o.find('.dropdown-filter').removeClass("filter-show"))
    });
    $('[data-toggle="tooltip"]').tooltip()

    $('.handlePrevent').each(function () {
        $(this).click(function (e) {
            e.preventDefault();
        })
    });

    // if (windowWidth < 992) {
    //     $('.mobile-init_width .card-body').each(function () {
    //         $(this).parent().css('width', $(this)[0].scrollWidth - 5 + 'px');
    //         $(this).css('width', $(this)[0].scrollWidth + 'px');
    //         $(this).next('.card-footer').css('width', $(this)[0].scrollWidth + 'px');
    //     });
    // }
});