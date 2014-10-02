/**
 * 응용 프로그램 캐시 테스트
 */
window.onload = function() {
	var a_div = document.getElementById("info");
	a_div.innerHTML = "HTML5 Application Cache";

	console.log( getApplicationStatus() );

	var appCache = window.applicationCache;
	appCache.addEventListener('updateready', function(e) {
    	if (appCache.status == appCache.UPDATEREADY) {
	    	if(confirm("업데이트를 이용할 수 있습니다. 업데이트를 하시겠습니까?")){
				window.location.reload();
			}
		}
	}, false);

	/*
	window.applicationCache.onupdateready = function(){
		window.applicationCache.swapCache();
		if(confirm('업데이트를 이용할 수 있습니다. 업데이트를 하시겠습니까?')){
			window.location.reload();
		}
	};
	*/
};

function getApplicationStatus() {
	var app = window.applicationCache;
	var status = 'UKNOWN';
	switch (app.status) {
	  case app.UNCACHED: // UNCACHED == 0
	    status = 'UNCACHED';
	    break;
	  case app.IDLE: // IDLE == 1
	    status = 'IDLE';
	    break;
	  case app.CHECKING: // CHECKING == 2
	    status = 'CHECKING';
	    break;
	  case app.DOWNLOADING: // DOWNLOADING == 3
	    status = 'DOWNLOADING';
	    break;
	  case app.UPDATEREADY:  // UPDATEREADY == 4
	    status = 'UPDATEREADY';
	    break;
	  case app.OBSOLETE: // OBSOLETE == 5
	    status = 'OBSOLETE';
	    break;
	  default:
	    status= 'UKNOWN';
	    break;
	};
	return status;
}