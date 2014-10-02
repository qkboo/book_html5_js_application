/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var Helloworld = cc.Layer.extend({
    isMouseDown:false,
    helloImg:null,
    helloLabel:null,
    circle:null,
    sprite:null,

    init:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        var size = cc.Director.getInstance().getWinSize();

        // add a "close" icon to exit the progress. it's an autorelease object
        var closeItem = cc.MenuItemImage.create(
            "res/CloseNormal.png",
            "res/CloseSelected.png",
            function () {
                history.go(-1);
            },this);
        closeItem.setAnchorPoint(0.5, 0.5);

        var menu = cc.Menu.create(closeItem);
        menu.setPosition(0,0);
        this.addChild(menu, 1);
        closeItem.setPosition(size.width - 20, 20);

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        this.helloLabel = cc.LabelTTF.create("Hello World", "Arial", 38);
        // position the label on the center of the screen
        this.helloLabel.setPosition(size.width / 2, 0);
        // 새로운 앵커 지정
        //this.helloLabel.setAnchorPoint(Point(1, 1));

        // add the label as a child to this layer
        this.addChild(this.helloLabel, 5);

        // 새로운 라벨 추가
        this.logLabel = cc.LabelTTF.create("touched[x,y]", "Serif", 12);
        this.logLabel.setPosition(size.width/20, size.height - 50);
        this.addChild(this.logLabel, 2);
        
        var lazyLayer = cc.Layer.create();
        this.addChild(lazyLayer);

        // add "HelloWorld" splash screen"
        this.sprite = cc.Sprite.create("res/HelloWorld.png");
        this.sprite.setPosition(size.width / 2, size.height / 2);
        // sprite의 새로운 앵커를 지정
        //this.sprite.setAnchorPoint( Point(1.0, 1.0));//cc.p(1, 1));

        this.sprite.setScale(0.5);
        this.sprite.setRotation(180);

        lazyLayer.addChild(this.sprite, 0);

        var rotateToA = cc.RotateTo.create(2, 0);
        var scaleToA = cc.ScaleTo.create(2, 1, 1);

        this.sprite.runAction(cc.Sequence.create(rotateToA, scaleToA));
        this.helloLabel.runAction(cc.Spawn.create(cc.MoveBy.create(2.5, cc.p(0, size.height - 40)),cc.TintTo.create(2.5,255,125,0)));

        // 새로운 sprite
        this.sprite1 = cc.Sprite.create("res/grossini.png");
        this.sprite1.setPosition(size.width / 2, size.height / 2);
        this.addChild(this.sprite1, 10);
        
        this.sprite2 = cc.Sprite.create("res/grossinis_sister1.png");
        this.sprite2.setPosition(size.width / 2, size.height / 2);
        this.addChild(this.sprite2, 20);
        
        this.label1 = cc.LabelTTF.create("Grossini 님", "Sans", 14);
        this.label1.setPosition(45, 0);
        this.sprite1.addChild(this.label1);
        
        // Sprite1 애니메이션 - Scale
        var scale = cc.ScaleBy.create(2, 5);
        var scale_back = scale.reverse();
        var seq = cc.Sequence.create(scale, scale_back);
        var repeat = cc.RepeatForever.create(seq);
        
        this.sprite1.runAction(repeat);
        
        
        // Sprite2 애니메이션 Move
        var actionTo = cc.MoveTo.create(2, cc.p(size.width - 100, size.height - 100));
        var actionBy = cc.MoveBy.create(1, cc.p(80, 80));
        var actionByBack = actionBy.reverse();
        var seq2 = cc.Sequence.create(actionTo, actionBy);
        
        var repeat2 = cc.RepeatForever.create(seq2);
        this.sprite2.runAction(repeat2);

        
        // Animate
        // --- Manual animation
        //
        this.sprite3 = cc.Sprite.create("res/grossini_dance_01.png");
        this.sprite3.setPosition(size.width / 10, size.height / 2);
        this.addChild(this.sprite3, 15);

        var animation = cc.Animation.create();
        for (var i = 1; i < 15; i++) {
            var frameName = "res/grossini_dance_" + ((i < 10) ? ("0" + i) : i) + ".png";
            animation.addSpriteFrameWithFile(frameName);
        }
        animation.setDelayPerUnit(2.8 / 14);
        animation.setRestoreOriginalFrame(true);

        var action = cc.Animate.create(animation);
        this.sprite3.runAction(cc.Sequence.create(action, action.reverse()));
        
        
        
        this.setTouchEnabled(true);
        return true;
    },
    // a selector callback
    menuCloseCallback:function (sender) {
        cc.Director.getInstance().end();
    },
    onTouchesBegan:function (touches, event) {
        this.isMouseDown = true;
        // 라벨에 터치 시작 표시  
        this.logLabel.setString('X:'   
            + touches[0].getLocation().x + "/Y:"   
            + touches[0].getLocation().y); 

    },
    onTouchesMoved:function (touches, event) {
        if (this.isMouseDown) {
            if (touches) {
                this.circle.setPosition(touches[0].getLocation().x, touches[0].getLocation().y);
            }
        }
    },
    onTouchesEnded:function (touches, event) {
        this.isMouseDown = false;
        this.logLabel.setString('touched[x,y]');
    },
    onTouchesCancelled:function (touches, event) {
        console.log("onTouchesCancelled");
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new Helloworld();
        layer.init();
        this.addChild(layer);
    }
});

