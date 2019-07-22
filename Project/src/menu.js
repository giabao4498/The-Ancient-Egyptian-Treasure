MenuScene = cc.Scene.extend({
    onEnter: function () {
        this._super();

        cc.audioEngine.stopAllEffects();
        cc.audioEngine.playMusic(SOUND.MENU, true);

        const background = Image(MENU_BACKGROUND, CENTER_X, CENTER_Y, this);
        background.setScale(cc.winSize.width / background.width, cc.winSize.height / background.height);

        Image(TITLE, background.width * 0.6, background.height * 0.95, background);

        const startButton = Button(BUTTON_1, background.width / 4.5, background.height / 4.5, background);
        Text("START", startButton.width / 2, startButton.height / 2, FONT_20, startButton);
        startButton.addClickEventListener(function() {
            cc.audioEngine.playEffect(SOUND.CLICK);
            cc.director.runScene(new MazeScene());
        });

        const tutorialButton = Button(BUTTON_1, background.width / 2, background.height / 4.5, background);
        Text("TUTORIAL", tutorialButton.width / 2, tutorialButton.height / 2, FONT_20, tutorialButton);
        tutorialButton.addClickEventListener(function() {
            cc.audioEngine.playEffect(SOUND.CLICK);
            cc.director.runScene(new TutorialScene());
        });

        const storyButton = Button(BUTTON_1, background.width * 7 / 9, background.height / 4.5, background);
        Text("STORY", storyButton.width / 2, storyButton.height / 2, FONT_20, storyButton);
        storyButton.addClickEventListener(function() {
            cc.audioEngine.playEffect(SOUND.CLICK);
            cc.director.runScene(new StoryScene());
        });

        const authorButton = Button(BUTTON_1, background.width / 4.5, background.height / 9, background);
        Text("AUTHOR", authorButton.width / 2, authorButton.height / 2, FONT_20, authorButton);
        authorButton.addClickEventListener(function() {
            cc.audioEngine.playEffect(SOUND.CLICK);
            cc.director.runScene(new AuthorScene());
        });

        const resetButton = Button(BUTTON_1, background.width / 2, background.height / 9, background);
        Text("RESET", resetButton.width / 2, resetButton.height / 2, FONT_20, resetButton);
        const resetData = Image(RESET_DATA, background.width / 2, background.height / 2, background);
        resetData.setVisible(false);
        const yesButton = Button(BUTTON_1, resetData.width / 3, resetData.height / 4, resetData);
        Text("YES", yesButton.width / 2, yesButton.height / 2, FONT_20, yesButton);
        yesButton.addClickEventListener(function() { // reset data
            cc.audioEngine.playEffect(SOUND.CLICK);
            cc.sys.localStorage.clear();
            resetData.setVisible(false);
        });
        const noButton = Button(BUTTON_3, resetData.width * 2 / 3, resetData.height / 4, resetData);
        Text("NO", noButton.width / 2, noButton.height / 2, FONT_20, noButton);
        noButton.addClickEventListener(function() {
            cc.audioEngine.playEffect(SOUND.CLICK);
            resetData.setVisible(false);
        });
        resetButton.addClickEventListener(function() {
            cc.audioEngine.playEffect(SOUND.CLICK);
            resetData.setVisible(true);
        });

        const quitButton = Button(BUTTON_1, background.width * 7 / 9, background.height / 9, background);
        Text("QUIT", quitButton.width / 2, quitButton.height / 2, FONT_20, quitButton);
        quitButton.addClickEventListener(function() {
            cc.audioEngine.playEffect(SOUND.CLICK);
            cc.director.end();
        });
    }
});