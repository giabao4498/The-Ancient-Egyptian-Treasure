AuthorScene = TextScene.extend({
    onEnter: function() {
        this._super();

        Text("Author: Bao Nguyen.\nThis game is made for education purpose only.\nI do not own copyrights of contents.", CENTER_X, CENTER_Y, FONT_24, this);
    }
});