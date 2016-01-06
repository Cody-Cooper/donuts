$(document).ready(function(){
      $('.parallax').parallax();
      $('.scrollspy').scrollSpy();
      $('.materialboxed').materialbox();
      $('.button-collapse').sideNav({
          closeOnClick: true
      });

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
