var Content = {
  name : 'Name', // 팟캐스트의 이름
  url : 'Url',   // RSS Uri
  type : ['mp3', 'ogg'] // 미디어 형식
};

var Podcast = function(content) {
  this.name = content.name;
  this.url = content.url;
  this.type = content.type[0];
};

var PodManager = function() {
  var podList = [];
  
  this.addPodcast(p) {
    podList.push(p);
  };
  
  this.delPodcast(p) {
    
  };
  
};

//=============================================
//                  Controller
//=============================================
var Render = {
  render : function(obj) {
    var output = document.querySelector('#content > article');
    var content = ['ㅁㅁㅁㅁ', 'ㅇㅇㅇㅇ', 'ㅎㅎㅎㅎㅎ'];
    output.innerHTML = content;
    //JSON.parse( content);
  }
};
