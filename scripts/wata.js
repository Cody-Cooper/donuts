/*!
 * Wata
 * Project Website: http://wata.pimmey.com
 *
 * @version 1.0
 * @author Yegor Borisenco <pimmey@pimmey.com>
 *
 */

'use strict';

(function() {
    var triangles = document.getElementById('triangles'),
        nav = document.getElementById('nav'),
        windowHeight,
        navHeight,
        trianglesHeight;

    function resizeTriangles() {
        windowHeight = window.innerHeight;
        navHeight = nav.clientHeight;
        trianglesHeight = windowHeight - navHeight;
        triangles.style.height = trianglesHeight + 'px';
    }

    resizeTriangles();
    window.addEventListener('resize', resizeTriangles);
})();

function dissmissPreloader() {
    var $preloader = $('#preloader'),
        $body = $('body');

    $body.css('overflow-y', 'auto');
    $preloader.fadeOut('fast');
}

function trianglesReady() {
    dissmissPreloader();
}

$(document).ready(function() {
    $('.scrollspy').scrollSpy();
    $('.materialboxed').materialbox();
    $('.button-collapse').sideNav({
        closeOnClick: true
    });

    ScrollAnimations();

    Shuffle.init();

    CurrencySwitcher();

    var $masonry = $('.masonry').masonry({
        itemSelector: '.col'
    });

    $masonry.imagesLoaded().progress(function() {
        $masonry.masonry('layout');
    });

    var mcForm = $('form#mc-embedded-subscribe-form');
    mcForm.ajaxChimp({
        url: $(this).attr('action'),
        callback: function(resp) {
            var message = resp.msg,
                result = resp.result,
                dissmissTime = result === 'success' ? 10000 : 5000;
            Materialize.toast(message.replace(/\d - /, ''), dissmissTime, result);
            if (result === 'success') {
                mcForm.find('input[type=email]').val('');
                mcForm.find('label').removeClass('active');
            }
        }
    });

    (function() {
        var contactForm = $('form#contact-form'),
            contactFormFields = contactForm.find('input, textarea'),
            submitButton = contactForm.find('button[type=submit]'),
            activeButtonClass = 'waves-effect waves-light green accent-2 indigo-text text-darken-4',
            requiredFields = $('.required'),
            requiredFieldsLength = requiredFields.length,
            email = contactForm.find('input#email'),
            isFormReady = false,
            status = $('div#status');

        contactForm.on('submit', function(e) {
            e.preventDefault();

            if (isFormReady) {
                submitForm();
            } else {
                if ( ! checkRequired()) {
                    Materialize.toast(Wata.toastMessages.fillInRequiredFields, 5000, 'error');
                }
                if ( checkRequired() && ! isEmailValid()) {
                    Materialize.toast(Wata.toastMessages.enterValidEmail, 5000, 'error');
                }
            }
        });

        contactFormFields.on('blur', function() {
            checkForm();
        });

        email.on('blur', function() {
            var emailValueLength = email[0].value.length;
            if ( ! isEmailValid() && emailValueLength > 0) {
                email.addClass('invalid').removeClass('valid');
            } else if (isEmailValid() && emailValueLength > 0) {
                email.addClass('valid').removeClass('invalid');
            } else if (emailValueLength === 0) {
                email.removeClass('valid invalid');
            }
        });

        function checkRequired() {
            for (var i = 0; i < requiredFieldsLength; i++) {
                if (requiredFields[i].value.length === 0) {
                    return false;
                }
            }

            return true;
        }

        function isEmailValid() {
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return email[0].value.length > 0 && re.test(email[0].value);
        }

        function checkForm() {
            if (checkRequired() && isEmailValid()) {
                submitButton.addClass(activeButtonClass);
                isFormReady = true;
            } else {
                submitButton.removeClass(activeButtonClass);
                isFormReady = false;
            }
        }

        function submitForm() {
            status.show();
            $.ajax({
                url: contactForm.attr('action'),
                data: contactForm.serialize(),
                type: 'POST'
            }).done(function(resp) {
                status.hide();
                if (resp == 'success') {
                    Materialize.toast(Wata.toastMessages.messageSent, 7500, 'success');
                    contactFormFields.val('');
                    email.removeClass('valid');
                    checkForm();
                } else {
                    Materialize.toast(Wata.toastMessages.somethingWrong + resp, 7500, 'error');
                }
            }).error(function(err) {
                status.hide();
                Materialize.toast(Wata.toastMessages.somethingWrong + resp, 7500, 'error');
            });
        }
    })();

    $('#explore').on('click', function(e) {
        e.preventDefault();
        var offset = $('#services').offset().top + 1;
        $('html, body').animate({
            scrollTop: offset - 64
        }, {
            duration: 400,
            queue: false,
            easing: 'easeOutCubic'
        });
    });

    (function() {
        var scrollPosition,
            wrapper = $('#wrapper'),
            ajaxBox = $('#ajax-box'),
            isMobile = window.matchMedia("only screen and (max-width: 600px)"),
            isParallax;

        $('a.ajax-link').on('click', function(e) {
            e.preventDefault();

            scrollPosition = $(document).scrollTop();

            ajaxBox.load($(this).attr('href'), function(resp, status, xhr) {
                if (status === 'error') {
                    unLoadAjax();
                    Materialize.toast(Wata.toastMessages.somethingWrong + xhr.status + ' ' + xhr.statusText, 5000, 'error');
                    return false;
                }

                wrapper.fadeOut('fast', function() {
                    window.scrollTo(0, 0);
                });

                $('.materialboxed').length && $('.materialboxed').materialbox();
                $('ul.tabs').length && $('ul.tabs').tabs();

                ajaxBox.addClass('enter');

                setTimeout(function() {
                    ajaxBox.removeClass('translate enter');
                    $('#ajax-status').hide();

                    isParallax = $('.parallax').length;

                    if (isParallax && ! isMobile.matches) {
                        $('.parallax').parallax();
                    } else if (isParallax && isMobile) {
                        $('.parallax img').css({
                            display: 'block',
                            height: 500
                        })
                    }
                }, 750);
            });
        });

        $(document).on('click', '#close-ajax', function(e) {
            e.preventDefault();
            unLoadAjax();
        });

        function unLoadAjax() {
            ajaxBox.removeClass('enter').addClass('translate').html('');
            wrapper.show().css('visibility', 'hidden');
            $(document).scrollTop(scrollPosition);
            wrapper.hide().css('visibility', 'visible').fadeIn();

            $('div#shuffle-grid').shuffle('update');
            $('.masonry').masonry();
        }
    })();

    initializeMap();

    $('.activator, .card-title').on('click', function() {
        $(this).parents('.card').toggleClass('active');
    });

    var tolerance = window.innerHeight * .65;

    $(window).scroll(function() {
        $('.picture-item:in-viewport(' + tolerance + ')').addClass('animate');
        $('.team .col:in-viewport(' + tolerance + ')').addClass('animate');
        $('.masonry .card:in-viewport(' + tolerance + ')').addClass('animate');
    });
});

var ScrollAnimations = function() {
    var controller = new ScrollMagic.Controller();
    var icons = $('.services .animated-color'),
        iconColors = [
            'rgb(26, 35, 126)',
            'rgb(28, 37, 135)',
            'rgb(29, 40, 143)',
            'rgb(31, 42, 152)',
            'rgb(33, 44, 160)',
            'rgb(36, 49, 178)',
            'rgb(38, 52, 186)',
            'rgb(39, 54, 199)',
            'rgb(41, 56, 203)',
            'rgb(43, 58, 211)'
        ];

    var sceneServiceIcons = new ScrollMagic.Scene({triggerElement: '#services', duration: '75%'})
        .addTo(controller);

    var sceneServiceIconsProgress;
    sceneServiceIcons.on('progress', function(event) {
        sceneServiceIconsProgress = Math.floor(event.progress * 10);
        icons.css('color', iconColors[sceneServiceIconsProgress]);
    });

    var scenePrices = new ScrollMagic.Scene({triggerElement: '.best-offer'})
        .setClassToggle('.best-offer', 'z-depth-4')
        .addTo(controller);

    var sceneGetStartedBg = new ScrollMagic.Scene({triggerElement: '#get-started', duration: '75%'})
        .addTo(controller);

    var sceneGetStartedBgProgress,
        getStartedGrayBgSection = $('#get-started'),
        grayShades = [
            '#f2f2f2',
            '#ededed',
            '#e8e8e8',
            '#e3e3e3',
            '#dedede',
            '#dcdcdc',
            '#d6d6d6',
            '#d3d3d3',
            '#d4d4d4',
            '#cfcfcf'
        ];

    sceneGetStartedBg.on('progress', function(event) {
        sceneGetStartedBgProgress = Math.floor(event.progress * 10);
        getStartedGrayBgSection.css('background-color', grayShades[sceneGetStartedBgProgress]);
    });

    var sceneSubscribeBg = new ScrollMagic.Scene({triggerElement: '#subscribe', duration: '75%'})
        .addTo(controller);

    var sceneSubscribeBgProgress,
        subscribeGrayBgSection = $('#subscribe');
    sceneSubscribeBg.on('progress', function(event) {
        sceneSubscribeBgProgress = Math.floor(event.progress * 10);
        subscribeGrayBgSection.css('background-color',  grayShades[sceneSubscribeBgProgress]);
    });
};

var Shuffle = (function($, imagesLoaded) {
    var $grid = $('div#shuffle-grid'),
        $imgs = $grid.find('img'),
        $filterOptions = $('div.filter-options'),
        $btns = $filterOptions.children(),
        $allButton = $('#all'),
        imgLoad,
        init,
        onAllImagesFinished;

    init = function() {
        imgLoad = new imagesLoaded($imgs.get());
        imgLoad.on('always', onAllImagesFinished);
    };

    onAllImagesFinished = function(instance) {
        $grid.shuffle({
            itemSelector: '.picture-item'
        });
    };

    $btns.on('click', function() {
        var $this = $(this),
            isActive = $this.hasClass( 'active' ),
            isAll = $this.attr('id') === 'all',
            group = isActive ? 'all' : $this.data('group');

        if (isActive && isAll) {
            return false;
        }

        if ( ! isActive) {
            $('.filter-options .active').removeClass('active');
        }

        if (isActive && ! isAll) {
            $allButton.addClass('active');
        }

        $this.toggleClass('active');

        if (isAll) {
            $allButton.addClass('active');
        }

        $grid.shuffle('shuffle', group);
    });

    $btns = null;

    return {
        init: init
    };
}(jQuery, window.imagesLoaded));

var CurrencySwitcher = function() {
    var $switcherContainer = $('.currency-switcher'),
        offers = Wata.currencySwitcher.offers,
        offersArray = Object.keys(offers),
        offersLength = offersArray.length,
        symbols = Wata.currencySwitcher.symbols,
        currency;

    $switcherContainer.find('input[type=radio]').on('change', function() {
        currency = this.id;
        for (var i = 0; i < offersLength; i++) {
            $('#' + offersArray[i]).find('.price').text(symbols[currency] + offers[offersArray[i]][currency]);
        }
    });
};

var map;
var infowindow;

function initMap() {
  var center = {lat: 47.318195, lng: -122.359133};
  var tacoma = {lat: 47.255316, lng: -122.470456};
  var auburn = {lat: 47.243236, lng: -122.211035};
  var kent = {lat: 47.357446, lng: -122.112768};

  map = new google.maps.Map(document.getElementById('map'), {
    center: center,
    zoom: 11
  });

  // Tacoma location marker
  var marker = new google.maps.Marker({
    map: map,
    position: tacoma,
    title: 'Tacoma Location'
  });

  // Auburn location marker
  var marker = new google.maps.Marker({
    map: map,
    position: auburn,
    title: 'Auburn Location'
  });

  // Covington location
  var marker = new google.maps.Marker({
    map: map,
    position: kent,
    title: 'Kent Location'
  });

}
