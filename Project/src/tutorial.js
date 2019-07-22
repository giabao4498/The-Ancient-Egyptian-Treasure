TutorialScene = TextScene.extend({
    onEnter: function() {
        this._super();

        const tutorial = Image(TUTORIAL, CENTER_X, CENTER_Y, this);
        tutorial.setScale(cc.winSize.width / tutorial.width, cc.winSize.height / tutorial.height);
    }
});