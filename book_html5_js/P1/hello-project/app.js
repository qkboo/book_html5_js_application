window.onload = function() {
  var output = document.querySelector('#content > article');
  var hello = new Hello('고강태');
  output.innerHTML = hello.getMessage();
}
