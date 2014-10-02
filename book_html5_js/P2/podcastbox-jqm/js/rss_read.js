$(document).ready(function () {
    $.ajax({
        url: 'https://api.baas.io/d156d7ec-23d2-11e2-a2c1-02003a570010/d169c3bb-23d2-11e2-a2c1-02003a570010/friends',
        type: 'GET',
        dataType: "json",
        success: function(data) {
           parseXml(data);
        }
    });
});

function parseXml(xml) {
  var item = $(xml).find("item");

  $(item).each(function() {
    console.log($("enclosure").attr("url").text());
    $("#results").append($("enclosure").attr("url").text() + "<br />");
  });

}