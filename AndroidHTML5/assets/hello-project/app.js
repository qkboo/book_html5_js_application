window.onload = function() {
  var output = document.querySelector('#content > article');
  var hello = new Hello('고강태');
  output.innerHTML = hello.getMessage();
  
  var btn = document.querySelector('#btn_alert');
  btn.addEventListener('click', function() {
	 alert("자바스크립트에서 alert()를 호출합니다!!!"); 
  });
}
