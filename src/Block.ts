class Block extends egret.Sprite
{
    private m_bg: egret.Bitmap;
    private m_image: egret.Bitmap;
    private m_title: egret.TextField;

    public constructor()
    {
        super();
        this.createView();
    }
    private textField: egret.TextField;

    private createView(): void
    {
        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.y = 300;
        this.textField.width = 480;
        this.textField.height = 100;
        this.textField.textAlign = "center";
    }

}
