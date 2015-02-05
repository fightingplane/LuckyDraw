/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

class Main extends egret.DisplayObjectContainer{

    /**
     * 加载进度界面
     */
    private loadingView:LoadingUI;
    private m_startBtn: egret.Bitmap;
    private m_selector: egret.Bitmap;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }

    private onAddToStage(event:egret.Event){
        //注入自定义的素材解析器
        egret.Injector.mapClass("egret.gui.IAssetAdapter",AssetAdapter);
        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        egret.gui.Theme.load("resource/theme.thm");
        //设置加载进度界面
        this.loadingView  = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.loadConfig("resource/resource.json","resource/");
    }
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     */
    private onConfigComplete(event:RES.ResourceEvent):void{
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
        RES.loadGroup("preload");
    }
    /**
     * preload资源组加载完成
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if(event.groupName=="preload"){
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
            this.createScene();
        }
    }
    /**
     * preload资源组加载进度
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if(event.groupName=="preload"){
            this.loadingView.setProgress(event.itemsLoaded,event.itemsTotal);
        }
    }

    private gameLayer:egret.DisplayObjectContainer;

    private guiLayer:egret.gui.UIStage;
    /**
     * 创建场景界面
     */
    private createScene():void{

        var width:number = this.stage.stageWidth;
        var height:number = this.stage.stageHeight;

        this.gameLayer = new egret.DisplayObjectContainer();
        this.addChild(this.gameLayer);
        var bitmap:egret.Bitmap = new egret.Bitmap();
        bitmap.texture = RES.getRes("lucky_draw_bg");
        bitmap.anchorX = bitmap.anchorY = 0.5;
        bitmap.x = width * 0.5;
        bitmap.y = height * 0.5;        
        this.gameLayer.addChild(bitmap);
        
        var startBtn: egret.Bitmap = new egret.Bitmap();
        startBtn.texture = RES.getRes("lucky_draw_start");
        startBtn.x = width * 0.5;
        startBtn.y = height * 0.5;
        startBtn.anchorX = startBtn.anchorY = 0.5;
        startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onStartTouched, this);
        this.gameLayer.addChild(startBtn);
        this.m_startBtn = startBtn;

        //create 9 block items
        var offset: number = 2;
        var b1: Block = new Block(Block.BLOCK_TYPE_NO_LUCK, 1);
        var szBlockHalfWidth:number = b1.width * 0.5;
        var szBlockHalfHeight:number = b1.height * 0.5;
        var szStartBtnHalfWidth:number = startBtn.width * 0.5;
        var szStartBtnHalfHeight: number = startBtn.height * 0.5;

        b1.x = startBtn.x - szBlockHalfWidth - szStartBtnHalfWidth - offset;
        b1.y = startBtn.y;
        this.gameLayer.addChild(b1);

        var b2: Block = new Block(Block.BLOCK_TYPE_MONEY, 1);
        b2.x = startBtn.x - szBlockHalfWidth - szStartBtnHalfWidth - offset;
        b2.y = startBtn.y - szBlockHalfHeight - szStartBtnHalfHeight - offset;
        this.gameLayer.addChild(b2);

        var b3: Block = new Block(Block.BLOCK_TYPE_NO_LUCK, 2);
        b3.x = startBtn.x;
        b3.y = startBtn.y - szBlockHalfHeight - szStartBtnHalfHeight - offset;
        this.gameLayer.addChild(b3);

        var b4: Block = new Block(Block.BLOCK_TYPE_MONEY, 5);
        b4.x = startBtn.x + szBlockHalfWidth + szStartBtnHalfWidth + offset;
        b4.y = startBtn.y - szBlockHalfHeight - szStartBtnHalfHeight - offset;
        this.gameLayer.addChild(b4);

        var b5: Block = new Block(Block.BLOCK_TYPE_NO_LUCK, 1);
        b5.x = startBtn.x + szBlockHalfWidth + szStartBtnHalfWidth + offset;
        b5.y = startBtn.y;
        this.gameLayer.addChild(b5);

        var b6: Block = new Block(Block.BLOCK_TYPE_MONEY, 10);
        b6.x = startBtn.x + szBlockHalfWidth + szStartBtnHalfWidth + offset;
        b6.y = startBtn.y + szBlockHalfHeight + szStartBtnHalfHeight + offset;
        this.gameLayer.addChild(b6);

        var b7: Block = new Block(Block.BLOCK_TYPE_NO_LUCK, 2);
        b7.x = startBtn.x;
        b7.y = startBtn.y + szBlockHalfWidth + szStartBtnHalfWidth + offset;
        this.gameLayer.addChild(b7);

        var b8: Block = new Block(Block.BLOCK_TYPE_MONEY, 20);
        b8.x = startBtn.x - szBlockHalfWidth - szStartBtnHalfWidth - offset;
        b8.y = startBtn.y + szBlockHalfHeight + szStartBtnHalfHeight + offset;
        this.gameLayer.addChild(b8);

        var selector: egret.Bitmap = new egret.Bitmap();
        selector.texture = RES.getRes("lucky_draw_selector");
        selector.x = b1.x;
        selector.y = b1.y;
        selector.anchorX = selector.anchorY = 0.5;
        selector.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onStartTouched, this);
        this.gameLayer.addChild(selector);
        this.m_selector = selector;

        //GUI的组件必须都在这个容器内部,UIStage会始终自动保持跟舞台一样大小。
        this.guiLayer = new egret.gui.UIStage();
        this.addChild(this.guiLayer);

/*        
        var button:egret.gui.Button = new egret.gui.Button();
        button.horizontalCenter = 0;
        button.verticalCenter = 0;
        button.label = "点击弹窗";
        button.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onButtonClick,this);
        //在GUI范围内一律使用addElement等方法替代addChild等方法。
        this.guiLayer.addElement(button);
*/
    }

    /*
    private onButtonClick(event:egret.TouchEvent):void{
        egret.gui.Alert.show("这是一个GUI弹窗!","弹窗")
    }
    */

    private onStartTouched(event: egret.TouchEvent): void
    {
        if (event.target == this.m_startBtn)
        {
            egret.Logger.info("Start button touched");
            this.m_startBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onStartTouched, this);
            //TODO: start action

        }
    }
}


