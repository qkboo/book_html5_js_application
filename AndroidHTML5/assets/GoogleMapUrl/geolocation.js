(function () {
  window.onload = function() {
    var btnPosition = document.querySelector("#btn_position");
    if (btnPosition) { 
        btnPosition.onclick = function () {
          showLocation();
        }
      }
  };
})();

function showLocation() {
  var info = document.getElementById("info");

  if (navigator.geolocation == undefined) {
    info.innerHTML = "위치 정보를 이용할 수 없습니다.";
    return;
  }

  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

  function successCallback(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var alt = position.coords.altitude;
    var acc = position.coords.accuracy;
          
    info.innerHTML = "위도: " + lat + "<br/>" + "경도: " + lon + "<br/>" + "표고: " + alt + "<br/>" + "Accuracy: " + acc + "<br/>";

    showMap("현재위치는...", position.coords);
  }

  function errorCallback(err) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        msg.innerHTML = "Geolocation 요청이 거부되었습니다."
        break;
      case error.POSITION_UNAVAILABLE:
        msg.innerHTML = "위치 정보가 존재하지 않습니다."
        break;
      case error.TIMEOUT:
        msg.innerHTML = "사용자 위치를 획득하는데 시간이 초과되었습니다."
        break;
      case error.UNKNOWN_ERROR:
        msg.innerHTML = "알수없는 에러가 발생했습니다."
        break;
    }
  }

};