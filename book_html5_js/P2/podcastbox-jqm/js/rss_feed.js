function loadRSS($) {
	$.ajax({
		type: "GET",
		// url : "https://api.baas.io/d156d7ec-23d2-11e2-a2c1-02003a570010/d169c3bb-23d2-11e2-a2c1-02003a570010/friends",
		url: "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&output=xml&num=999&q=http://wizard2.sbs.co.kr/w3/podcast/V0000328482.xml",
		// url: "http://deepwaterchurch.com/media/podcast/podcast.xml",
		dataType: "jsonp",
		timeout: 10000,
		success:function(data, textStatus, jqXHR) {
			// console.log (data.responseData.xmlString);
			xmlDoc = $.parseXML(data.responseData.xmlString);
			$(xmlDoc).find('item').each(function(){
				var title = $(this).find('title').text();
				var url = $(this).find('enclosure').attr('url');
				console.log(title + ":" + url);
				$("#friends-list").append("<li><a href='" + url + "'>" + title + "</a></li>");
			});
		},
    	error: function(jqXHR, textStatus, errorThrown) {console.log("error");}
	});
};