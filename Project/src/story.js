StoryScene = TextScene.extend({
    onEnter: function() {
        this._super();

        const story = Image(STORY, CENTER_X, CENTER_Y, this);
        story.setScale(cc.winSize.width / story.width, cc.winSize.height / story.height);
    }
});