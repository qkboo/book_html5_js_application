function showMap(msg, coord) {

  var oPoint = new nhn.api.map.LatLng( coord.latitude, coord.longitude);
  nhn.api.map.setDefaultPoint('LatLng');
  oMap = new nhn.api.map.Map('mapview' ,{
        point : oPoint,
        zoom : 10,
        enableWheelZoom : true,
        enableDragPan : true,
        enableDblClickZoom : false,
        mapMode : 0,
        activateTrafficMap : false,
        activateBicycleMap : false,
        minMaxLevel : [ 1, 14 ],
        size : new nhn.api.map.Size(500, 400)
      });

  var markerCount = 0;
  
  var oSize = new nhn.api.map.Size(28, 37);
  var oOffset = new nhn.api.map.Size(14, 37);
  var oIcon = new nhn.api.map.Icon('http://static.naver.com/maps2/icons/pin_spot2.png', oSize, oOffset);
  
  var mapInfoTestWindow = new nhn.api.map.InfoWindow(); // - info window 생성
  mapInfoTestWindow.setVisible(false); // - infowindow 표시 여부 지정.
  oMap.addOverlay(mapInfoTestWindow); // - 지도에 추가.   
  
  var oLabel = new nhn.api.map.MarkerLabel(); // - 마커 라벨 선언.
  oMap.addOverlay(oLabel); // - 마커 라벨 지도에 추가. 기본은 라벨이 보이지 않는 상태로 추가됨.

  mapInfoTestWindow.attach('changeVisible', function(oCustomEvent) {
    if (oCustomEvent.visible) {
      oLabel.setVisible(false);
    }
  });

  oMap.attach('mouseenter', function(oCustomEvent) {
    var oTarget = oCustomEvent.target;
    // 마커위에 마우스 올라간거면
    if (oTarget instanceof nhn.api.map.Marker) {
      var oMarker = oTarget;
      oLabel.setVisible(true, oMarker); // - 특정 마커를 지정하여 해당 마커의 title을 보여준다.
    }
  });
  
  oMap.attach('mouseleave', function(oCustomEvent) {
    var oTarget = oCustomEvent.target;
    // 마커위에서 마우스 나간거면
    if (oTarget instanceof nhn.api.map.Marker) {
      oLabel.setVisible(false);
    }
  });
  
  oMap.attach('click', function(oCustomEvent) {
    var oPoint = oCustomEvent.point;
    var oTarget = oCustomEvent.target;
    mapInfoTestWindow.setVisible(false);
    // 마커 클릭하면
    if (oTarget instanceof nhn.api.map.Marker) {
      
      if (oCustomEvent.clickCoveredMarker) { // 겹침 마커 클릭한거면
        return;
      }
      mapInfoTestWindow.setContent('<DIV style="border-top:1px solid; border-bottom:2px groove black; border-left:1px solid; border-right:2px groove black;margin-bottom:1px;color:black;background-color:white; width:auto; height:auto;">'+
      '<span style="color: #000000 !important;display: inline-block;font-size: 12px !important;font-weight: bold !important;letter-spacing: -1px !important;white-space: nowrap !important; padding: 2px 2px 2px 2px !important">' + 
      'Hello World <br /> ' + oTarget.getPoint()
      +'<span></div>');
      mapInfoTestWindow.setPoint(oTarget.getPoint());
      mapInfoTestWindow.setVisible(true);
      mapInfoTestWindow.setPosition({right : 15, top : 30});
      mapInfoTestWindow.autoPosition();
      return;
    }
    var oMarker = new nhn.api.map.Marker(oIcon, { title : '마커 : ' + oPoint.toString() });
    oMarker.setPoint(oPoint);
    oMap.addOverlay(oMarker);
  });
};
