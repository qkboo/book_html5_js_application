var AnimationLayer = cc.Layer.extend({
    spriteSheet:null,
    runningAction:null,
    sprite:null,

	ctor:function () {
        this._super();
        this.init();
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
       this.sprite = cc.Sprite.createWithSpriteFrameName("runner0.png");
       this.sprite.setPosition(cc.p(80, 85));
       this.sprite.runAction(this.runningAction);
       this.spriteSheet.addChild(this.sprite);
       
    }
});