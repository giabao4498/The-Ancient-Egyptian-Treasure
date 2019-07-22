function Image(path, x, y, parent) {
    const image = new ccui.ImageView(path);
    image.setPosition(x, y);
    parent.addChild(image);
    return image;
}

function Button(path, x, y, parent) {
    const button = new ccui.Button(path);
    button.setPosition(x, y);
    parent.addChild(button);
    return button;
}

function Text(content, x, y, font, parent) {
    const text = new cc.LabelBMFont(content, font);
    text.setPosition(x, y);
    parent.addChild(text);
    return text;
}

function Animation(path, numberOfTimes, x, y, parent, reverse, object, lightUp) {
    const listOfFrames = [];
    var check, i = 0;
    while (check = cc.Sprite.create(path + "_" + i + ".png")) {
        listOfFrames.push(check.getSpriteFrame());
        ++i;
    }
    const frame = new cc.Animation();
    if (reverse)
        for(i = listOfFrames.length - 1; i >= 0; --i)
            frame.addSpriteFrame(listOfFrames[i]);
    else
        for(i in listOfFrames)
            frame.addSpriteFrame(listOfFrames[i]);
    frame.setDelayPerUnit(TIME_EPSILON);
    const animation = new cc.Sprite();
    animation.setPosition(x, y);
    if (object) {
        animation.setLocalZOrder(object.getLocalZOrder());
        animation.setAnchorPoint(object.getAnchorPoint());
        animation.scale = object.scale;
    }
    if (numberOfTimes == Infinity)
        animation.runAction(cc.animate(frame).repeatForever());
    else
        animation.runAction(cc.sequence(
            cc.repeat(cc.animate(frame), numberOfTimes),
            cc.removeSelf(true),
            cc.callFunc(function() {
                if (object)
                    object.setVisible(true);
                switch (lightUp) {
                    case true:
                        BLACK.runAction(cc.sequence(
                            cc.fadeOut(1),
                            cc.removeSelf(true),
                            cc.callFunc(function() {
                                EXPLORER_UP.setLocalZOrder(Z_ORDER.EXPLORER);
                                EXPLORER_DOWN.setLocalZOrder(Z_ORDER.EXPLORER);
                                EXPLORER_LEFT.setLocalZOrder(Z_ORDER.EXPLORER);
                                EXPLORER_RIGHT.setLocalZOrder(Z_ORDER.EXPLORER);
                            })
                        ));
                        arrowState = keyState = true;
                        setMove();
                        reverseButtons();
                        cc.audioEngine.playEffect(SOUND.MUMMY_HOWL);
                        break;
                    case false:
                        cc.director.runScene(cc.TransitionFade(3, new WinningScene()));
                        cc.audioEngine.playMusic(SOUND.OPEN_TREASURE);
                        break;
                }
            })
        ));
    parent.addChild(animation);
    return animation;
}

function logicToFloor(coordinate, factor) {
    if (!factor)
        factor = 0.5;
    return (coordinate + factor) * TILE_SIZE;
}

TextScene = cc.Scene.extend({
    onEnter: function() {
        this._super();

        const background = Image(BACKGROUND, CENTER_X, CENTER_Y, this);
        background.setScale(cc.winSize.width / background.width, cc.winSize.height / background.height);
        const close = Button(CLOSE, cc.winSize.width, cc.winSize.height, this);
        close.setAnchorPoint(1, 1);
        close.addClickEventListener(function() {
            cc.audioEngine.playEffect(SOUND.CLICK);
            cc.director.runScene(new MenuScene());
        })
    }
});

function random(range) {
    return Math.floor(Math.random() * range);
}

function randomSound(path, amount, music) {
    path += "_" + random(amount) + ".mp3";
    switch (music) {
        case true: cc.audioEngine.playMusic(path); break;
        case undefined: cc.audioEngine.playEffect(path); break;
    }
}