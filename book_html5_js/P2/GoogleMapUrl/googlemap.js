function showMap(msg, coords) {

  var msg, mapview;
  mapview = document.getElementById('mapview')
  var lat = coords.latitude;
  var lon = coords.longitude;
  
  var uri = "http://maps.google.co.kr/?q=" + lat + "," + lon;
  mapview.innerHTML = 
  "<h1>지도 표시</h1>"
  + "<a href='" + uri + "'>현재 위치를 표시</a>";
};
