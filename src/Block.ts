class Block extends egret.Sprite
{
    public static BLOCK_TYPE_MONEY: number = 1;
    public static BLOCK_TYPE_NO_LUCK: number = 2;

    private m_bg: egret.Bitmap;
    private m_image: egret.Bitmap;
    private m_title: egret.TextField;
    private m_type: number;
    private m_typeNum: number;
    public constructor(type:number, typeNum:number)
    {
        super();
        this.m_type = type;
        this.m_typeNum = typeNum;
        this.createView();
    }
    private textField: egret.TextField;

    private createView(): void
    {
        var bg: egret.Bitmap = new egret.Bitmap();
        bg.texture = RES.getRes("lucky_draw_effect");
        bg.anchorX = bg.anchorY = 0.5;
        var width: number = bg.width;
        var height: number = bg.height; 
        this.width = width;
        this.height = height;
        this.anchorX = this.anchorY = 0.5;
        bg.anchorX = bg.anchorY = 0.5;
        bg.x = width * 0.5;
        bg.y = height * 0.5;
        this.addChild(bg);

        //create image
        if (this.m_type == Block.BLOCK_TYPE_MONEY)
        {
            var image: egret.Bitmap = new egret.Bitmap();
            image.texture = RES.getRes("lucky_draw_wallet");
            image.anchorX = image.anchorY = 0.5;
            image.x = width * 0.5;
            image.y = height * 0.65;
            this.addChild(image);

            var titleStr: string = "lucky_draw_money_" + this.m_typeNum.toString();
            var title: egret.Bitmap = new egret.Bitmap();
            title.texture = RES.getRes(titleStr);
            title.anchorX = image.anchorY = 0.5;
            title.x = width * 0.5;
            title.y = height * 0.15;
            this.addChild(title);
        }
        else
        {
            var image: egret.Bitmap = new egret.Bitmap();
            image.texture = RES.getRes("lucky_draw_flower");
            image.anchorX = image.anchorY = 0.5;
            image.x = width * 0.5;
            image.y = height * 0.65;
            this.addChild(image);

            var titleStr: string = "lucky_draw_money_unlucky_" + this.m_typeNum.toString();
            var title: egret.Bitmap = new egret.Bitmap();
            title.texture = RES.getRes(titleStr);
            title.anchorX = image.anchorY = 0.5;
            title.x = width * 0.5;
            title.y = height * 0.15;
            this.addChild(title);
        }
    }
}
