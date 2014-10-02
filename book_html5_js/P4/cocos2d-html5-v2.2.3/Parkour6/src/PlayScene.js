var PlayScene = cc.Scene.extend({
    space:null,

    //chipmunk의 space를 초기화 한다.
    initPhysics:function() {
        //1. 새로운 space object 
        this.space = new cp.Space();

        //2. Gravity 설정
        this.space.gravity = cp.v(0, -350);

        // 3. 벽을 설정
        var wallBottom = new cp.SegmentShape( this.space.staticBody,
            cp.v(0, g_groundHight),// 시작점
            cp.v(4294967295, g_groundHight),// MAX INT:4294967295
            0);// thickness of wall
        this.space.addStaticShape(wallBottom);
    },
    onEnter:function () {
        this._super();
        this.initPhysics();

        this.addChild(new BackgroundLayer(), 0, TagOfLayer.background);
        this.addChild(new AnimationLayer(this.space),0, TagOfLayer.Animation );
        this.addChild(new StatusLayer(),0, TagOfLayer.Status);
        this.scheduleUpdate();
    },
    update:function (dt) {
        // chipmunk step
        this.space.step(dt);
    }
});