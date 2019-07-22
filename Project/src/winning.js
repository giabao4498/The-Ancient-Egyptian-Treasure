WinningScene = cc.Scene.extend({
    onEnter: function() {
        this._super();

        const sequence = new cc.Node;
        this.addChild(sequence);
        sequence.runAction(cc.sequence(
            cc.delayTime(1.5),
            cc.callFunc(function() {
                randomSound(SOUND.WINNING, 2, true);
            })
        ));

        const winning = Image(WINNING, CENTER_X, CENTER_Y, this);
        winning.setScale(cc.winSize.width / winning.width, cc.winSize.height / winning.height);

        Text("YOU FOUND THE TREASURE!", CENTER_X, cc.winSize.height, FONT_24, this).setAnchorPoint(0.5, 1);

        const menu = Button(QUIT_TO_MAIN, CENTER_X, 0, this);
        menu.setAnchorPoint(0.5, 0);
        menu.scale = 1.4;
        menu.addClickEventListener(function() {
            cc.audioEngine.playEffect(SOUND.CLICK);
            cc.director.runScene(new MenuScene());
        });
    }
});