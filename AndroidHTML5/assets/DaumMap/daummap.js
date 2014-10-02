function showMap(msg, coord) {

    var position = new daum.maps.LatLng(coord.latitude, coord.longitude);

    var map = new daum.maps.Map(document.getElementById('map'), {
      center : position,
      level : 4,
      mapTypeId : daum.maps.MapTypeId.HYBRID
    });

    var marker = new daum.maps.Marker({
      position : position
    });
    marker.setMap(map);

    var infowindow = new daum.maps.InfoWindow({
      content : 'Hello, World!'
    });
    infowindow.open(map, marker);
};
