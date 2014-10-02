function showMap(msg, coords) {

  var msg, mapview;
  mapview = document.getElementById('mapview')

  var lat = coords.latitude;
  var lon = coords.longitude;
  var latlon = new google.maps.LatLng(lat, lon)

  mapview.style.height = '250px';
  mapview.style.width = '100%';

  var myOptions = {
    zoom : 16,
    center : latlon,
    mapTypeId : google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(mapview, myOptions);
};
