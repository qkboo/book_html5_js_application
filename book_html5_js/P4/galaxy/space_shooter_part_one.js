/***************
 * PART ONE - 게임 구조와 배경이동 설정 
 ***************/

/* RESOURCES
 * 1. http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * 2. http://net.tutsplus.com/tutorials/javascript-ajax/prototypes-in-javascript-what-you-need-to-know/
 * 3. http://phrogz.net/js/classes/OOPinJS.html
 * 4. http://www.phpied.com/3-ways-to-define-a-javascript-class/
 */


/**
 * 게임 초기화와 시작
 */
var game = new Game();

function init() {
	if(game.init())
		game.start();
}

/**
 * 게임에서 사용하는 이미지를 저장
 * 이런 객체는 싱글톤으로 생성
 */
var imageRepository = new function() {
	// Define images
	this.empty = null;
	this.background = new Image();
	
	// Set images src
	this.background.src = "imgs/bg.png";
}


/**
 * 게임에서 그려지는 개체인 Drawable
 */
function Drawable() {	
	this.init = function(x, y) {
		this.x = x;
		this.y = y;
	}

	this.speed = 0;
	this.canvasWidth = 0;
	this.canvasHeight = 0;
	
	// 자식이 구현할 함수
	this.draw = function() {
	};
}


/**
 * Drawable의 자식인 Background 객체로 캔버스 배경을 그린다.
 */
function Background() {
	this.speed = 1; // 배경의 이동 속도
	
	// draw 함수 -  배경 그리기
	this.draw = function() {
		this.y += this.speed;
		// 배경을 y만큼 이동해서 그린다.
		this.context.drawImage(imageRepository.background, this.x, this.y);
		
		// 배경이 y만큼 이동한 위치에 이어서 배경을 그린다.
		this.context.drawImage(imageRepository.background, this.x, this.y - this.canvasHeight);

		// 이미지가 캔버스 크기만큰 스크롤 되면 초기화한다.
		if (this.y >= this.canvasHeight)
			this.y = 0;
	};
}
// Drawable 상속
Background.prototype = new Drawable();


/**
 * 게임에 필요한 객체와 데이터를 저장하는 게임 객체
 */
function Game() {

	this.init = function() {
		this.bgCanvas = document.getElementById('background');
		
		if (this.bgCanvas.getContext) {
			this.bgContext = this.bgCanvas.getContext('2d');
		
			// Background에 캔버스 정보를 초기화한다.
			Background.prototype.context = this.bgContext;
			Background.prototype.canvasWidth = this.bgCanvas.width;
			Background.prototype.canvasHeight = this.bgCanvas.height;
			
			// Background 생성
			this.background = new Background();
			this.background.init(0,0);
			return true;
		} else {
			return false;
		}
	};
	
	// 게임 루프 시작
	this.start = function() {
		animate();
	};
}


function animate() {
	requestAnimFrame( animate );
	game.background.draw();
}


/**	
 * requestAnim shim layer by Paul Irish
 * Finds the first API that works to optimize the animation loop, 
 * otherwise defaults to setTimeout().
 */
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();