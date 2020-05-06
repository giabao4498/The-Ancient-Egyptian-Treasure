const explorerPos = cc.p(-1, -1);
const mummyPos = cc.p(-1, -1);
const destination = cc.p(-1, -1);
var FLOOR, BLACK, BLOCK, DUST, NEXT_LEVEL, CHAMBER;
var explorer, EXPLORER_UP, EXPLORER_DOWN, EXPLORER_LEFT, EXPLORER_RIGHT;
var MUMMY_UP, MUMMY_DOWN, MUMMY_LEFT, MUMMY_RIGHT, mummy, mummyType, MUMMY_WIN;
const matrix = [];
var listOfKeys;
var upButton, downButton, leftButton, rightButton, passTurn, undoMove, resetMaze, ankh, head;
var arrowState, stairsDirection, currentLevel, keyState;
var turn; // stack
/* {
    explorer: {x, y, direction},
    mummy: {x, y, direction}
} */

MazeScene = cc.Scene.extend({
    onEnter: function() {
        this._super();

        arrowState = keyState = false;

        const backdrop = Image(BACKDROP, 0, 0, this);
        backdrop.setAnchorPoint(0, 0);
        backdrop.setScale(cc.winSize.width * 0.75 / backdrop.width, cc.winSize.height / backdrop.height);

        const torch1 = Image(TORCH, backdrop.width / 3, backdrop.height * 0.875, backdrop);
        Animation(FLAME, Infinity, torch1.width / 2, torch1.height * 1.5, torch1);

        const torch2 = Image(TORCH, backdrop.width * 2 / 3, backdrop.height * 0.875, backdrop);
        Animation(FLAME, Infinity, torch2.width / 2, torch2.height * 1.5, torch2);

        FLOOR = Image(FLOOR_IMAGE, backdrop.width / 2, backdrop.height * 26 / 57, backdrop);

        const map = Image(MAP, cc.winSize.width, cc.winSize.height, this);
        map.setAnchorPoint(1, 1);
        map.scale = cc.winSize.width / 4 / map.width;
        Text("Level", map.width * 0.2, map.height * 0.85, FONT_16, map);
        CHAMBER = Text("", map.width * 0.2, map.height * 0.65, FONT_16, map);
        ankh = Button(ANKH, map.width * 0.85, map.height * 0.75, map);
        ankh.setZoomScale(0);
        head = Image(HEAD, 0, 0, map);

        const controlBoard = Image(CONTROL_BOARD, cc.winSize.width, 0, this);
        controlBoard.setAnchorPoint(1, 0);
        controlBoard.setScale(cc.winSize.width / 4 / controlBoard.width, (cc.winSize.height - map.height * map.getScaleY()) / controlBoard.height);

        Button(QUIT_TO_MAIN, controlBoard.width / 2, controlBoard.height * 0.9, controlBoard).addClickEventListener(function() {
            cc.audioEngine.playEffect(SOUND.CLICK);
            cc.director.runScene(new MenuScene());
        });

        resetMaze = Button(RESET_MAZE, controlBoard.width / 2, controlBoard.height * 0.7, controlBoard);
        resetMaze.addClickEventListener(function() {
            cc.audioEngine.playEffect(SOUND.CLICK);
            if (turn.length > 1) {
                do
                    turn.pop();
                while (turn.length > 1);
                rollBack();
            }
        });

        undoMove = Button(UNDO_MOVE, controlBoard.width / 2, controlBoard.height * 0.5, controlBoard);
        undoMove.addClickEventListener(function() {
            cc.audioEngine.playEffect(SOUND.CLICK);
            if (turn.length > 1) {
                turn.pop();
                rollBack();
            }
        });

        upButton = Button(UP_BUTTON, controlBoard.width / 2, controlBoard.height / 3, controlBoard);
        upButton.addClickEventListener(function() {
            cc.audioEngine.playEffect(SOUND.CLICK);
            up();
        });

        downButton = Button(DOWN_BUTTON, controlBoard.width / 2, controlBoard.height / 16, controlBoard);
        downButton.addClickEventListener(function() {
            cc.audioEngine.playEffect(SOUND.CLICK);
            down();
        });

        leftButton = Button(LEFT_BUTTON, controlBoard.width / 5, controlBoard.height / 5, controlBoard);
        leftButton.addClickEventListener(function() {
            cc.audioEngine.playEffect(SOUND.CLICK);
            left();
        });

        rightButton = Button(RIGHT_BUTTON, controlBoard.width * 0.8, controlBoard.height / 5, controlBoard);
        rightButton.addClickEventListener(function() {
            cc.audioEngine.playEffect(SOUND.CLICK);
            right();
        });

        passTurn = Button(CIRCLE, controlBoard.width / 2, controlBoard.height / 5, controlBoard);
        Text("Pass\nturn", passTurn.width / 2, passTurn.height / 2, FONT_12, passTurn);
        passTurn.addClickEventListener(function() {
            cc.audioEngine.playEffect(SOUND.CLICK);
            pass();
        });

        setMove();
        reverseButtons();

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(key)
            {
                if (keyState)
                    switch (key) {
                        case KEY_CODE.UP: up(); break;
                        case KEY_CODE.DOWN: down(); break;
                        case KEY_CODE.LEFT: left(); break;
                        case KEY_CODE.RIGHT: right(); break;
                        case KEY_CODE.SPACE: pass(); break;
                    }
            }
        }, this);

        NEXT_LEVEL = Image(NEXT_LEVEL_IMAGE, 0, 0, this);
        NEXT_LEVEL.setAnchorPoint(0, 0);
        NEXT_LEVEL.setScale(cc.winSize.width * 0.75 / backdrop.width, cc.winSize.height / backdrop.height);
        NEXT_LEVEL.setVisible(false);
        Text("WELL DONE!", NEXT_LEVEL.width / 2, NEXT_LEVEL.height * 0.75, FONT_24, NEXT_LEVEL);
        Animation("res/image/explorer_down", Infinity, NEXT_LEVEL.width / 2, NEXT_LEVEL.height / 2, NEXT_LEVEL).scale = 2;
        const nextLevel = Button(BUTTON_2, NEXT_LEVEL.width / 2, NEXT_LEVEL.height * 0.25, NEXT_LEVEL);
        nextLevel.setScaleX(2.75);
        nextLevel.setScaleY(1.5);
        Text("NEXT CHAMBER", NEXT_LEVEL.width / 2, NEXT_LEVEL.height * 0.25, FONT_24, NEXT_LEVEL);
        nextLevel.addClickEventListener(function() {
            cc.audioEngine.playEffect(SOUND.CLICK);
            NEXT_LEVEL.setVisible(false);
            if (currentLevel < MAX_LEVEL) {
                Image(CROSS, LEVEL[String.fromCharCode(currentLevel + 64)].x, LEVEL[String.fromCharCode(currentLevel + 64)].y, map);
                loadMaze(++currentLevel);
            }
            else {
                FLOOR.removeAllChildren();
                const stairs = Image(STAIRS_BOTTOM, FLOOR.width / 2, 0, FLOOR);
                stairs.setAnchorPoint(0.5, 1);
                stairs.setLocalZOrder(Z_ORDER.STAIRS);
                Image(CHEST, stairs.x, TILE_SIZE * 3.5, FLOOR);
                explorer = Image(EXPLORER_UP_IMAGE, 0, 0, FLOOR);
                explorer.setVisible(false);
                explorer.setPosition(stairs.x, TILE_SIZE * 2.5);
                Animation("res/image/explorer_up", 6, stairs.x, -TILE_SIZE * 0.5, FLOOR, false, explorer, false).runAction(cc.moveBy(MOVE_TIME * 3 , 0, TILE_SIZE * 3));
            }
        });

        var i;
        for(i = 0; i < MAZE_SIZE; ++i) {
            matrix.push([]);
            for(var j = 0; j < MAZE_SIZE; ++j)
                matrix[i].push(null);
        }

        loadMaze(currentLevel = parseInt(cc.sys.localStorage.getItem("chamber")) || FIRST_LEVEL);

        for(i = 65; i - 64 < currentLevel; ++i)
            Image(CROSS, LEVEL[String.fromCharCode(i)].x, LEVEL[String.fromCharCode(i)].y, map);
    }
});

function setMove() {
    upButton.enabled = downButton.enabled = leftButton.enabled = rightButton.enabled = passTurn.enabled = arrowState;
}

function reverseButtons() {
    resetMaze.enabled = undoMove.enabled = !undoMove.enabled;
}

function loadMaze(id) {
    cc.audioEngine.playMusic(SOUND.MAZE, true);
    CHAMBER.setString(id);
    FLOOR.removeAllChildren();
    head.setPosition(LEVEL[String.fromCharCode(id + 64)]);
    const maze = cc.loader.getRes("res/data/maze_" + id + ".json");
    var x, y, i, tmp;
    for(x = 0; x < MAZE_SIZE; ++x)
        matrix[x][0] = {
            state: EMPTY_ID,
            top: true,
            right: true,
            bottom: false,
            left: true
        };
    for(y = MAZE_SIZE - 2; y > 0; --y) {
        for(x = 0; x < MAZE_SIZE; ++x)
            matrix[x][y] = {
                state: EMPTY_ID,
                top: true,
                right: true,
                bottom: true,
                left: true
            };
        matrix[0][y].left = matrix[MAZE_SIZE - 1][y].right = false;
    }
    for(x = 0; x < MAZE_SIZE; ++x)
        matrix[x][MAZE_SIZE - 1] = {
            state: EMPTY_ID,
            top: false,
            right: true,
            bottom: true,
            left: true
        };
    matrix[0][0].left = matrix[MAZE_SIZE - 1][0].right = matrix[0][MAZE_SIZE - 1].left = matrix[MAZE_SIZE - 1][MAZE_SIZE - 1].right = false;
    for(i in maze.trap) {
        matrix[maze.trap[i].x][maze.trap[i].y].state = TRAP_ID;
        Image(TRAP, logicToFloor(maze.trap[i].x), logicToFloor(maze.trap[i].y), FLOOR).setLocalZOrder(Z_ORDER.TRAP);
    }
    switch (maze.stairs.type) {
        case "top":
            tmp = Image(STAIRS_TOP, logicToFloor(maze.stairs.index), FLOOR.height, FLOOR);
            tmp.setAnchorPoint(0.5, 0);
            tmp.setLocalZOrder(Z_ORDER.STAIRS);
            destination.x = maze.stairs.index;
            destination.y = MAZE_SIZE - 1;
            stairsDirection = DIRECTION.UP;
            break;
        case "bottom":
            tmp = Image(STAIRS_BOTTOM, logicToFloor(maze.stairs.index), 0, FLOOR);
            tmp.setAnchorPoint(0.5, 1);
            tmp.setLocalZOrder(Z_ORDER.STAIRS);
            destination.x = maze.stairs.index;
            destination.y = 0;
            stairsDirection = DIRECTION.DOWN;
            break;
        case "left":
            tmp = Image(STAIRS_LEFT, 0, logicToFloor(maze.stairs.index), FLOOR);
            tmp.setAnchorPoint(1, 0.5);
            tmp.setLocalZOrder(Z_ORDER.STAIRS);
            destination.x = 0;
            destination.y = maze.stairs.index;
            stairsDirection = DIRECTION.LEFT;
            break;
        case "right":
            tmp = Image(STAIRS_RIGHT, FLOOR.width, logicToFloor(maze.stairs.index), FLOOR);
            tmp.setAnchorPoint(0, 0.5);
            tmp.setLocalZOrder(Z_ORDER.STAIRS);
            destination.x = MAZE_SIZE - 1;
            destination.y = maze.stairs.index;
            stairsDirection = DIRECTION.RIGHT;
            break;
    }
    mummyType = maze.mummy.type;
    mummyPos.x = maze.mummy.x;
    mummyPos.y = maze.mummy.y;
    MUMMY_UP = Image(MUMMY_UP_IMAGE[mummyType], 0, 0, FLOOR);
    MUMMY_UP.setVisible(false);
    MUMMY_UP.setLocalZOrder(Z_ORDER.MUMMY);
    MUMMY_DOWN = Image(MUMMY_DOWN_IMAGE[mummyType], logicToFloor(mummyPos.x), logicToFloor(mummyPos.y), FLOOR);
    MUMMY_DOWN.setLocalZOrder(Z_ORDER.MUMMY);
    MUMMY_LEFT = Image(MUMMY_LEFT_IMAGE[mummyType], 0, 0, FLOOR);
    MUMMY_LEFT.setVisible(false);
    MUMMY_LEFT.setLocalZOrder(Z_ORDER.MUMMY);
    MUMMY_RIGHT = Image(MUMMY_RIGHT_IMAGE[mummyType], 0, 0, FLOOR);
    MUMMY_RIGHT.setVisible(false);
    MUMMY_RIGHT.setLocalZOrder(Z_ORDER.MUMMY);
    mummy = MUMMY_DOWN;
    MUMMY_WIN = Image(MUMMY_WIN_IMAGE[mummyType], 0, 0, FLOOR);
    MUMMY_WIN.setVisible(false);
    MUMMY_WIN.setLocalZOrder(Z_ORDER.EXPLORER);
    EXPLORER_UP = Image(EXPLORER_UP_IMAGE, 0, 0, FLOOR);
    EXPLORER_UP.setVisible(false);
    EXPLORER_DOWN = Image(EXPLORER_DOWN_IMAGE, 0, 0, FLOOR);
    EXPLORER_DOWN.setVisible(false);
    EXPLORER_LEFT = Image(EXPLORER_LEFT_IMAGE, 0, 0, FLOOR);
    EXPLORER_LEFT.setVisible(false);
    EXPLORER_RIGHT = Image(EXPLORER_RIGHT_IMAGE, 0, 0, FLOOR);
    EXPLORER_RIGHT.setVisible(false);
    explorer = EXPLORER_DOWN; // arbitrary assignment
    listOfKeys = [];
    turn = [{
        mummy: {x: mummyPos.x, y: mummyPos.y, direction: MUMMY_DOWN},
        key: []
    }];
    for(i in maze.tool) {
        if (matrix[maze.tool[i].key.x][maze.tool[i].key.y].state == TRAP_ID)
            matrix[maze.tool[i].key.x][maze.tool[i].key.y].state = {trap: true};
        else
            matrix[maze.tool[i].key.x][maze.tool[i].key.y].state = {};
        matrix[maze.tool[i].key.x][maze.tool[i].key.y].state.closed = Image(GATE_CLOSED, logicToFloor(maze.tool[i].gate.x), logicToFloor(maze.tool[i].gate.y, 1), FLOOR);
        matrix[maze.tool[i].key.x][maze.tool[i].key.y].state.opened = Image(GATE_OPENED, logicToFloor(maze.tool[i].gate.x), logicToFloor(maze.tool[i].gate.y, 1), FLOOR);
        matrix[maze.tool[i].key.x][maze.tool[i].key.y].state.gateX = maze.tool[i].gate.x;
        matrix[maze.tool[i].key.x][maze.tool[i].key.y].state.gateY = maze.tool[i].gate.y;
        matrix[maze.tool[i].key.x][maze.tool[i].key.y].state.gateState = GATE_STATE.CLOSED;
        matrix[maze.tool[i].key.x][maze.tool[i].key.y].state.closed.setAnchorPoint(0.45, 0.2);
        matrix[maze.tool[i].key.x][maze.tool[i].key.y].state.opened.setAnchorPoint(0.45, 0.2);
        matrix[maze.tool[i].key.x][maze.tool[i].key.y].state.closed.setLocalZOrder(Z_ORDER.GATE_CLOSED);
        matrix[maze.tool[i].key.x][maze.tool[i].key.y].state.opened.setLocalZOrder(Z_ORDER.GATE_OPENED);
        matrix[maze.tool[i].key.x][maze.tool[i].key.y].state.opened.setVisible(false);
        Animation(KEY, Infinity, logicToFloor(maze.tool[i].key.x), logicToFloor(maze.tool[i].key.y), FLOOR);
        matrix[maze.tool[i].gate.x][maze.tool[i].gate.y].top = false;
        matrix[maze.tool[i].gate.x][maze.tool[i].gate.y + 1].bottom = false;
        listOfKeys.push(matrix[maze.tool[i].key.x][maze.tool[i].key.y].state);
        turn[0].key.push(matrix[maze.tool[i].key.x][maze.tool[i].key.y].state.gateState);
    }
    for(i in maze.wall) {
        switch (maze.wall[i].type) {
            case "horizontal":
                tmp = Image(WALL_HORIZONTAL, logicToFloor(maze.wall[i].x), logicToFloor(maze.wall[i].y, 1), FLOOR);
                tmp.setAnchorPoint(0.45, 0.2);
                tmp.setLocalZOrder(Z_ORDER.WALL);
                matrix[maze.wall[i].x][maze.wall[i].y].top = false;
                matrix[maze.wall[i].x][maze.wall[i].y + 1].bottom = false;
                break;
            case "vertical_0":
                tmp = Image(WALL_VERTICAL_0, logicToFloor(maze.wall[i].x, 1), logicToFloor(maze.wall[i].y), FLOOR);
                tmp.setAnchorPoint(0.3, 0.4);
                tmp.setLocalZOrder(Z_ORDER.WALL);
                matrix[maze.wall[i].x][maze.wall[i].y].right = false;
                matrix[maze.wall[i].x + 1][maze.wall[i].y].left = false;
                break;
            case "vertical_1":
                tmp = Image(WALL_VERTICAL_1, logicToFloor(maze.wall[i].x, 1), logicToFloor(maze.wall[i].y), FLOOR);
                tmp.setAnchorPoint(0.25, 0.43);
                tmp.setLocalZOrder(Z_ORDER.WALL);
                matrix[maze.wall[i].x][maze.wall[i].y].right = false;
                matrix[maze.wall[i].x + 1][maze.wall[i].y].left = false;
                break;
        }
    }
    BLACK = new cc.LayerColor(cc.color.BLACK);
    BLACK.setPosition(FLOOR.width / 2, FLOOR.height / 2);
    BLACK.scale = cc.winSize.height / BLACK.scale;
    BLACK.setLocalZOrder(Z_ORDER.BLACK);
    FLOOR.addChild(BLACK);
    BLOCK = Image(BLOCK_IMAGE, 0, 0, FLOOR);
    BLOCK.scale = 1;
    BLOCK.setAnchorPoint(0.5, 0.3);
    BLOCK.setLocalZOrder(Z_ORDER.BLOCK);
    BLOCK.setVisible(false);
    DUST = Animation("res/image/dust", Infinity, 0, 0, FLOOR);
    DUST.setLocalZOrder(Z_ORDER.DUST);
    DUST.scale = 1.75;
    DUST.runAction(cc.fadeOut(0));
    if (matrix[maze.explorer.x][maze.explorer.y].top || maze.explorer.y == MAZE_SIZE - 1) { // move down from the top
        explorerPos.x = maze.explorer.x;
        explorerPos.y = MAZE_SIZE;
        EXPLORER_DOWN.setLocalZOrder(Z_ORDER.EXPLORER_START);
        explorerMoveDown(explorerPos.y - maze.explorer.y, true);
        turn[0].explorer = {x: explorerPos.x, y: explorerPos.y, direction: EXPLORER_DOWN};
    }
    else if (matrix[maze.explorer.x][maze.explorer.y].bottom || maze.explorer.y == 0) { // move up from the bottom
        explorerPos.x = maze.explorer.x;
        explorerPos.y = -1;
        EXPLORER_UP.setLocalZOrder(Z_ORDER.EXPLORER_START);
        explorerMoveUp(maze.explorer.y - explorerPos.y, true);
        turn[0].explorer = {x: explorerPos.x, y: explorerPos.y, direction: EXPLORER_UP};
    }
    else if (matrix[maze.explorer.x][maze.explorer.y].left || maze.explorer.x == 0) { // move right from the left
        explorerPos.x = -1;
        explorerPos.y = maze.explorer.y;
        EXPLORER_RIGHT.setLocalZOrder(Z_ORDER.EXPLORER_START);
        explorerMoveRight(maze.explorer.x - explorerPos.x, true);
        turn[0].explorer = {x: explorerPos.x, y: explorerPos.y, direction: EXPLORER_RIGHT};
    }
    else { // move left from the right
        explorerPos.x = MAZE_SIZE;
        explorerPos.y = maze.explorer.y;
        EXPLORER_LEFT.setLocalZOrder(Z_ORDER.EXPLORER_START);
        explorerMoveLeft(explorerPos.x - maze.explorer.x, true);
        turn[0].explorer = {x: explorerPos.x, y: explorerPos.y, direction: EXPLORER_LEFT};
    }
}

function addTurn() {
    turn.push({
        explorer: {x: explorerPos.x, y: explorerPos.y, direction: explorer},
        mummy: {x: mummyPos.x, y: mummyPos.y, direction: mummy},
        key: []
    });
    const last = turn.length - 1;
    for(var i in listOfKeys)
        turn[last].key.push(listOfKeys[i].gateState);
}

function rollBack() {
    explorer.setVisible(false);
    mummy.setVisible(false);
    MUMMY_WIN.setVisible(false);
    BLOCK.setVisible(false);
    DUST.runAction(cc.fadeOut(0));
    const last = turn.length - 1;
    explorerPos.x = turn[last].explorer.x;
    explorerPos.y = turn[last].explorer.y;
    explorer = turn[last].explorer.direction;
    mummyPos.x = turn[last].mummy.x;
    mummyPos.y = turn[last].mummy.y;
    mummy = turn[last].mummy.direction;
    explorer.setPosition(logicToFloor(explorerPos.x), logicToFloor(explorerPos.y));
    explorer.setVisible(true);
    mummy.setVisible(true);
    mummy.setPosition(logicToFloor(mummyPos.x), logicToFloor(mummyPos.y));
    for(var i = 0; i < turn[last].key.length; ++i) {
        if (turn[last].key[i] == GATE_STATE.CLOSED) {
            matrix[listOfKeys[i].gateX][listOfKeys[i].gateY].top = false;
            matrix[listOfKeys[i].gateX][listOfKeys[i].gateY + 1].bottom = false;
            listOfKeys[i].gateState = GATE_STATE.CLOSED;
            listOfKeys[i].opened.setVisible(false);
            listOfKeys[i].closed.setVisible(true);
        }
        else {
            matrix[listOfKeys[i].gateX][listOfKeys[i].gateY].top = true;
            matrix[listOfKeys[i].gateX][listOfKeys[i].gateY + 1].bottom = true;
            listOfKeys[i].gateState = GATE_STATE.OPENED;
            listOfKeys[i].closed.setVisible(false);
            listOfKeys[i].opened.setVisible(true);
        }
    }
    ankh.enabled = true;
    arrowState = keyState = true;
    collided = false;
    setMove();
}

function escape() {
    randomSound(SOUND.ESCAPE, 2, true);
    if (currentLevel < MAX_LEVEL)
        cc.sys.localStorage.setItem("chamber", currentLevel + 1);
    NEXT_LEVEL.setVisible(true);
}

function up() {
    if (matrix[explorerPos.x][explorerPos.y].top && (explorerPos.x != mummyPos.x || explorerPos.y + 1 != mummyPos.y)) {
        arrowState = keyState = false;
        setMove();
        reverseButtons();
        explorerMoveUp(1);
        key(explorerPos);
        passedTurn = false;
        if (matrix[explorerPos.x][explorerPos.y].state == TRAP_ID || matrix[explorerPos.x][explorerPos.y].state.trap)
            trapped();
        else
            mummyMove();
    }
}

function down() {
    if (matrix[explorerPos.x][explorerPos.y].bottom && (explorerPos.x != mummyPos.x || explorerPos.y - 1 != mummyPos.y)) {
        arrowState = keyState = false;
        setMove();
        reverseButtons();
        explorerMoveDown(1);
        key(explorerPos);
        passedTurn = false;
        if (matrix[explorerPos.x][explorerPos.y].state == TRAP_ID || matrix[explorerPos.x][explorerPos.y].state.trap)
            trapped();
        else
            mummyMove();
    }
}

function left() {
    if (matrix[explorerPos.x][explorerPos.y].left && (explorerPos.x - 1 != mummyPos.x || explorerPos.y != mummyPos.y)) {
        arrowState = keyState = false;
        setMove();
        reverseButtons();
        explorerMoveLeft(1);
        key(explorerPos);
        passedTurn = false;
        if (matrix[explorerPos.x][explorerPos.y].state == TRAP_ID || matrix[explorerPos.x][explorerPos.y].state.trap)
            trapped();
        else
            mummyMove();
    }
}

function right() {
    if (matrix[explorerPos.x][explorerPos.y].right && (explorerPos.x + 1 != mummyPos.x || explorerPos.y != mummyPos.y)) {
        arrowState = keyState = false;
        setMove();
        reverseButtons();
        explorerMoveRight(1);
        key(explorerPos);
        passedTurn = false;
        if (matrix[explorerPos.x][explorerPos.y].state == TRAP_ID || matrix[explorerPos.x][explorerPos.y].state.trap)
            trapped();
        else
            mummyMove();
    }
}

function pass() {
    arrowState = keyState = false;
    setMove();
    reverseButtons();
    passedTurn = true;
    mummyMove();
}
