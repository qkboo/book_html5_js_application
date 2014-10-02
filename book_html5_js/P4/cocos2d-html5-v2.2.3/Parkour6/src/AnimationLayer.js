var AnimationLayer = cc.Layer.extend({
    spriteSheet:null,
    runningAction:null,
    sprite:null,
    space:null,
    body:null,
    shape:null,


    ctor:function (space) {
        this._super();
        this.space = space;
        this.init();

        this._debugNode = cc.PhysicsDebugNode.create(this.space);
        this._debugNode.setVisible(false);
        // Parallax ratio and offset
        this.addChild(this._debugNode, 10);

    },

    init:function () {
        this._super();

       //1.스프라이트 시트들 읽어들입니다. 
       cc.SpriteFrameCache.getInstance().addSpriteFrames(s_runnerplist);
       this.spriteSheet = cc.SpriteBatchNode.create(s_runner);
       this.addChild(this.spriteSheet);
       
       //2.스프라이트 프레임 배열
       var animFrames = [];
       for (var i = 0; i < 8; i++) {
           var str = "runner" + i + ".png";
           var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(str);
           animFrames.push(frame);
       }
       
       //3.스프라이트 프레임 배열에서 적절한 시간에 애니메이션을 만든다.
       var animation = cc.Animation.create(animFrames, 0.1);

       //4.계속 반복하는 액션
       this.runningAction = cc.RepeatForever.create(cc.Animate.create(animation));
     
       // PhysicsSprite를 스프라이트 프레임에서 생성
       this.sprite = cc.PhysicsSprite.createWithSpriteFrameName("runner0.png");
       var contentSize = this.sprite.getContentSize();
       // physic body 생성
       this.body = new cp.Body(1, cp.momentForBox(1, contentSize.width, contentSize.height));
       // 캐릭터의 위치 설정
       this.body.p = cc.p(g_runnerStartX, g_groundHight + contentSize.height / 2);
       // body에 자극 적용
       this.body.applyImpulse(cp.v(150, 0), cp.v(0, 0));//run speed
       // space에 body를 추가
       this.space.addBody(this.body);
       // body에서 사용할 형상을 생성
       this.shape = new cp.BoxShape(this.body, contentSize.width - 14, contentSize.height);
       // 생성한 형상을 space에 추가
       this.space.addShape(this.shape);
       // PhysicsSprite에 body를 설정
       this.sprite.setBody(this.body);
       
       
//       this.sprite = cc.Sprite.createWithSpriteFrameName("runner0.png");
//       this.sprite.setPosition(cc.p(80, 85));
       this.sprite.runAction(this.runningAction);
       this.spriteSheet.addChild(this.sprite);
       
       this.scheduleUpdate();
    },
    getEyeX:function () {
        return this.sprite.getPositionX() - g_runnerStartX;
    },

    update:function (dt) {
        var eyeX = this.sprite.getPositionX() - g_runnerStartX;
        var camera = this.getCamera();
        var eyeZ = cc.Camera.getZEye();
        camera.setEye(eyeX, 0, eyeZ);
        camera.setCenter(eyeX, 0, 0);
    }
});