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

var MenuLayer = cc.Layer.extend({
    isMouseDown:false,
    helloImg:null,
    helloLabel:null,
    circle:null,
    sprite:null,

    init:function () {

        //////////////////////////////
        this._super();
        // 1. super init first

        //////////////////////////////
        // 2. get the singleton director
        var director = cc.Director.getInstance();
        
        /////////////////////////////
        // 3. Window size
        var winsize = director.getWinSize();

        /////////////////////////////
         //4. calculate the center point
        var centerpos = cc.p(winsize.width / 2, winsize.height / 2);
        
        /////////////////////////////
        //5. create a background image and set it's position at the center of the screen
        var spritebg = cc.Sprite.create(s_PlayBG);
        spritebg.setPosition(centerpos);
        this.addChild(spritebg);
        

        //6.
        cc.MenuItemFont.setFontSize(60);

        //7.create a menu and assign onPlay event callback to it
        var menuItemPlay= cc.MenuItemSprite.create(
            cc.Sprite.create(s_StartNormal), // normal state image
            cc.Sprite.create(s_StartSelected), //select state image
            this.onPlay, this);
        var menu = cc.Menu.create(menuItemPlay);  //7. create the menu
        menu.setPosition(centerpos);
        this.addChild(menu);
        
        /////////////////////////////
        // 종료 버튼 
        var closeItem = cc.MenuItemImage.create(
            s_CloseNormal,
            s_CloseSelected,
            this.menuCloseCallback,
            this);
        closeItem.setAnchorPoint(0.5, 0.5);

        var menu = cc.Menu.create(closeItem);
        menu.setPosition(0, 0);
        this.addChild(menu, 1);
        closeItem.setPosition(winsize.width - 20, 20);

    },
    // menuItemPlay 버튼을 클릭하면 호출되는 콜백 함수
    onPlay : function(){
        cc.log("==onplay clicked");
        var director = cc.Director.getInstance();
        director.replaceScene(new PlayScene());
    },
    // a selector callback
    menuCloseCallback:function (sender) {
        cc.Director.getInstance().end();
    },
    // 
    goBackCallback:function () {
        history.go(-1);
    }
});

var MenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MenuLayer();
        this.addChild(layer);
        layer.init();
    }
});
