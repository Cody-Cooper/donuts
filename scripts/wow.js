$(document).ready(function(){
      $('.parallax').parallax();
      $('.scrollspy').scrollSpy();
      $('.materialboxed').materialbox();
      $('.button-collapse').sideNav({
          closeOnClick: true
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


      ScrollAnimations();
      initMap();

    });


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
