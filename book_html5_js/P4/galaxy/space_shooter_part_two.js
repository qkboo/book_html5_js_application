/***************
 * PART TWO - 게임 진행을 위한 캐릭터 이동
 ***************/

/* RESOURCES
 * 1. http://gamedev.tutsplus.com/tutorials/implementation/object-pools-help-you-reduce-lag-in-resource-intensive-games/
 * 2. http://gameprogrammingpatterns.com/object-pool.html
 * 3. http://www.slideshare.net/ernesto.jimenez/5-tips-for-your-html5-games
 * 4. http://www.kontain.com/fi/entries/94636/ (quote on performace)
 * 5. http://code.bytespider.eu/post/21438674255/dirty-rectangles
 * 6. http://www.html5rocks.com/en/tutorials/canvas/performance/
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
  this.background = new Image(); // 배경
  this.spaceship = new Image();  //
  this.bullet = new Image();

  // 게임 시작전에 이미지를 가져와야 한다.
  var numImages = 3;
  var numLoaded = 0;
  function imageLoaded() {
    numLoaded++;
    if (numLoaded === numImages) {
      window.init();
    }
  }
  this.background.onload = function() {
    imageLoaded();
  }
  this.spaceship.onload = function() {
    imageLoaded();
  }
  this.bullet.onload = function() {
    imageLoaded();
  }
  
  // Set images src
  this.background.src = "imgs/bg.png";
  this.spaceship.src = "imgs/ship.png";
  this.bullet.src = "imgs/bullet.png";
}


/**
 * 게임에서 그려지는 개체인 Drawable
 *  - move 선언
 */
function Drawable() {
  this.init = function(x, y, width, height) {
    // Defualt variables
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  
  this.speed = 0;
  this.canvasWidth = 0;
  this.canvasHeight = 0;
  
  this.draw = function() {
  };
  this.move = function() {
  };
}


/**
 * Drawable의 자식인 Background 객체로 캔버스 배경을 그린다.
 */
function Background() {
  this.speed = 1; // 배경의 이동 속도
  
  // draw 함수 구현
  this.draw = function() {
    // 배경 그리기
    this.y += this.speed;
    this.context.drawImage(imageRepository.background, this.x, this.y);
    
    // 첫번째 이미지의 캔버스 높이 위치에 이미지를 그린다.
    this.context.drawImage(imageRepository.background, this.x, this.y - this.canvasHeight);

    // 이미지가 캔버스 크기만큰 스크롤 되면 초기화한다.
    if (this.y >= this.canvasHeight)
      this.y = 0;
  };
}
// Drawable 상속
Background.prototype = new Drawable();


/**
 * 캐릭터가 발사하는 총알을 표현한 Bullet 객체로 main 캔버스에 그려진다.
 */
function Bullet() {  
  this.alive = false; // 총알을 사용하면 true
  
  this.spawn = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.alive = true;
  };

  /*
   * '임시 사각형'으로 총알을 지운다.
   */
  this.draw = function() {
    this.context.clearRect(this.x, this.y, this.width, this.height);
    this.y -= this.speed;
    if (this.y <= 0 - this.height) {
      return true;
    }
    else {
      this.context.drawImage(imageRepository.bullet, this.x, this.y);
    }
  };
  
  /*
   * Resets the bullet values
   */
  this.clear = function() {
    this.x = 0;
    this.y = 0;
    this.speed = 0;
    this.alive = false;
  };
}
Bullet.prototype = new Drawable();


/**
 * Pool 객체는 총알 객체들을 가비지컬랙션에서 유지 시켜주는 역할을 한다.
 */
function Pool(maxSize) {
  var size = maxSize; // 풀에 저장할 최대 크기의 총알
  var pool = [];
  
  this.init = function() {
    for (var i = 0; i < size; i++) {
      var bullet = new Bullet();
      bullet.init(0,0, imageRepository.bullet.width,
                  imageRepository.bullet.height);
      pool[i] = bullet;
    }
  };
  
  /*
   * pool에서 마지막 Bullet 아이템이 alive 상태면 spwan() 호출해서 화면에 그린다.
   * pool의 마지막에 있는 아이템을 꺼내 pool의 첫번째 아이템으로 추가한다.
   */
  this.get = function(x, y, speed) {
    if(!pool[size - 1].alive) {
      pool[size - 1].spawn(x, y, speed);
      pool.unshift(pool.pop());
    }
  };
  
  /*
   * Ship에서 두 개의 총알을 사용할 수 있도록 한다. 
   */
  this.getTwo = function(x1, y1, speed1, x2, y2, speed2) {
    if(!pool[size - 1].alive && 
       !pool[size - 2].alive) {
        this.get(x1, y1, speed1);
        this.get(x2, y2, speed2);
       }
  };
  
  /*
   * pool안의 alive 상태의 Bullet을 그린다. Bullet이 스크린 경계에 닿으면
   * 화면에서 지우고 배열에서 꺼내 배열의 첫번째로 이동 시킨다.
   */
  this.animate = function() {
    for (var i = 0; i < size; i++) {
      // Only draw until we find a bullet that is not alive
      if (pool[i].alive) {
        if (pool[i].draw()) {
          pool[i].clear();
          pool.push((pool.splice(i,1))[0]);
        }
      }
      else
        break;
    }
  };
}


/**
 * Ship 객체는 캐릭터가 조정한다. ship 캔버스에 그려진다.
 */
function Ship() {
  this.speed = 3;
  this.bulletPool = new Pool(30);
  this.bulletPool.init();

  var fireRate = 15;
  var counter = 0;
  
  this.draw = function() {
    this.context.drawImage(imageRepository.spaceship, this.x, this.y);
  };
  this.move = function() {  
    counter++;
    if (KEY_STATUS.left || KEY_STATUS.right ||
      KEY_STATUS.down || KEY_STATUS.up) {
      // 지운다.
      this.context.clearRect(this.x, this.y, this.width, this.height);
      
      // x, y 좌표를 이동 방향으로 갱신한다.
      if (KEY_STATUS.left) {
        this.x -= this.speed
        if (this.x <= 0) // Keep player within the screen
          this.x = 0;
      } else if (KEY_STATUS.right) {
        this.x += this.speed
        if (this.x >= this.canvasWidth - this.width)
          this.x = this.canvasWidth - this.width;
      } else if (KEY_STATUS.up) {
        this.y -= this.speed
        if (this.y <= this.canvasHeight/4*3)
          this.y = this.canvasHeight/4*3;
      } else if (KEY_STATUS.down) {
        this.y += this.speed
        if (this.y >= this.canvasHeight - this.height)
          this.y = this.canvasHeight - this.height;
      }
      
      this.draw();
    }
    
    if (KEY_STATUS.space && counter >= fireRate) {
      this.fire();
      counter = 0;
    }
  };
  
  /*
   * 총알 발사
   */
  this.fire = function() {
    this.bulletPool.getTwo(this.x+6, this.y, 3,
                           this.x+33, this.y, 3);
  };
}
Ship.prototype = new Drawable();


 /**
 * 게임에 필요한 객체와 데이터를 저장하는 게임 객체
 */
function Game() {
  this.init = function() {
    // Get the canvas elements
    this.bgCanvas = document.getElementById('background');
    this.shipCanvas = document.getElementById('ship');
    this.mainCanvas = document.getElementById('main');
    
    // Test to see if canvas is supported. Only need to
    // check one canvas
    if (this.bgCanvas.getContext) {
      this.bgContext = this.bgCanvas.getContext('2d');
      this.shipContext = this.shipCanvas.getContext('2d');
      this.mainContext = this.mainCanvas.getContext('2d');
    
      // Initialize objects to contain their context and canvas
      // information
      Background.prototype.context = this.bgContext;
      Background.prototype.canvasWidth = this.bgCanvas.width;
      Background.prototype.canvasHeight = this.bgCanvas.height;
      
      Ship.prototype.context = this.shipContext;
      Ship.prototype.canvasWidth = this.shipCanvas.width;
      Ship.prototype.canvasHeight = this.shipCanvas.height;
      
      Bullet.prototype.context = this.mainContext;
      Bullet.prototype.canvasWidth = this.mainCanvas.width;
      Bullet.prototype.canvasHeight = this.mainCanvas.height;
      
      // Initialize the background object
      this.background = new Background();
      this.background.init(0,0); // Set draw point to 0,0
      
      // Initialize the ship object
      this.ship = new Ship();
      // Set the ship to start near the bottom middle of the canvas
      var shipStartX = this.shipCanvas.width/2 - imageRepository.spaceship.width;
      var shipStartY = this.shipCanvas.height/4*3 + imageRepository.spaceship.height*2;
      this.ship.init(shipStartX, shipStartY, imageRepository.spaceship.width,
                     imageRepository.spaceship.height);

      return true;
    } else {
      return false;
    }
  };
  
  // Start the animation loop
  this.start = function() {
    this.ship.draw();
    animate();
  };
}


function animate() {
  requestAnimFrame( animate );
  game.background.draw();
  game.ship.move();
  game.ship.bulletPool.animate(); 
}


// 키코드
KEY_CODES = {
  32: 'space',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
}

//키 눌림 상태
KEY_STATUS = {};
for (code in KEY_CODES) {
  KEY_STATUS[KEY_CODES[code]] = false;
}
document.onkeydown = function(e) {
  // Firefox and opera use charCode instead of keyCode to
  // return which key was pressed.
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
  e.preventDefault();
  KEY_STATUS[KEY_CODES[keyCode]] = true;
  }
}
document.onkeyup = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = false;
  }
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