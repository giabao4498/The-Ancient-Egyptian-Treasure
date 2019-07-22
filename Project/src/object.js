function explorerMoveUp(step, lightUp) {
    randomSound(SOUND.EXPLORER, 6, lightUp ? false : undefined);
    explorer.setVisible(false);
    explorer = EXPLORER_UP;
    const explorerX = logicToFloor(explorerPos.x);
    const explorerY = logicToFloor(explorerPos.y);
    Animation("res/image/explorer_up", step * 2, explorerX, explorerY, FLOOR, false, explorer, lightUp).runAction(cc.moveBy(step * MOVE_TIME, 0, step * TILE_SIZE));
    explorerPos.y += step;
    explorer.setPosition(explorerX, explorerY + step * TILE_SIZE);
}

function explorerMoveDown(step, lightUp) {
    randomSound(SOUND.EXPLORER, 6, lightUp ? false : undefined);
    explorer.setVisible(false);
    explorer = EXPLORER_DOWN;
    const explorerX = logicToFloor(explorerPos.x);
    const explorerY = logicToFloor(explorerPos.y);
    Animation("res/image/explorer_down", step * 2, explorerX, explorerY, FLOOR, false, explorer, lightUp).runAction(cc.moveBy(step * MOVE_TIME, 0, -step * TILE_SIZE));
    explorerPos.y -= step;
    explorer.setPosition(explorerX, explorerY - step * TILE_SIZE);
}

function explorerMoveLeft(step, lightUp) {
    randomSound(SOUND.EXPLORER, 6, lightUp ? false : undefined);
    explorer.setVisible(false);
    explorer = EXPLORER_LEFT;
    const explorerX = logicToFloor(explorerPos.x);
    const explorerY = logicToFloor(explorerPos.y);
    Animation("res/image/explorer_left", step * 2, explorerX, explorerY, FLOOR, false, explorer, lightUp).runAction(cc.moveBy(step * MOVE_TIME, -step * TILE_SIZE, 0));
    explorerPos.x -= step;
    explorer.setPosition(explorerX - step * TILE_SIZE, explorerY);
}

function explorerMoveRight(step, lightUp) {
    randomSound(SOUND.EXPLORER, 6, lightUp ? false : undefined);
    explorer.setVisible(false);
    explorer = EXPLORER_RIGHT;
    const explorerX = logicToFloor(explorerPos.x);
    const explorerY = logicToFloor(explorerPos.y);
    Animation("res/image/explorer_right", step * 2, explorerX, explorerY, FLOOR, false, explorer, lightUp).runAction(cc.moveBy(step * MOVE_TIME, step * TILE_SIZE, 0));
    explorerPos.x += step;
    explorer.setPosition(explorerX + step * TILE_SIZE, explorerY);
}

function mummyMoveUp(type) {
    mummy.setVisible(false);
    mummy = MUMMY_UP;
    const mummyX = logicToFloor(mummyPos.x);
    const mummyY = logicToFloor(mummyPos.y);
    Animation("res/image/" + type + "Mummy_up", 2, mummyX, mummyY, FLOOR, false, mummy).runAction(cc.moveBy(MOVE_TIME, 0, TILE_SIZE));
    ++mummyPos.y;
    mummy.setPosition(mummyX, mummyY + TILE_SIZE);
}

function mummyMoveDown(type) {
    mummy.setVisible(false);
    mummy = MUMMY_DOWN;
    const mummyX = logicToFloor(mummyPos.x);
    const mummyY = logicToFloor(mummyPos.y);
    Animation("res/image/" + type + "Mummy_down", 2, mummyX, mummyY, FLOOR, false, mummy).runAction(cc.moveBy(MOVE_TIME, 0, -TILE_SIZE));
    --mummyPos.y;
    mummy.setPosition(mummyX, mummyY - TILE_SIZE);
}

function mummyMoveLeft(type) {
    mummy.setVisible(false);
    mummy = MUMMY_LEFT;
    const mummyX = logicToFloor(mummyPos.x);
    const mummyY = logicToFloor(mummyPos.y);
    Animation("res/image/" + type + "Mummy_left", 2, mummyX, mummyY, FLOOR, false, mummy).runAction(cc.moveBy(MOVE_TIME, -TILE_SIZE, 0));
    --mummyPos.x;
    mummy.setPosition(mummyX - TILE_SIZE, mummyY);
}

function mummyMoveRight(type) {
    mummy.setVisible(false);
    mummy = MUMMY_RIGHT;
    const mummyX = logicToFloor(mummyPos.x);
    const mummyY = logicToFloor(mummyPos.y);
    Animation("res/image/" + type + "Mummy_right", 2, mummyX, mummyY, FLOOR, false, mummy).runAction(cc.moveBy(MOVE_TIME, TILE_SIZE, 0));
    ++mummyPos.x;
    mummy.setPosition(mummyX + TILE_SIZE, mummyY);
}

function mummyMove() {
    arrowState = true;
    const sequence1 = new cc.Node;
    FLOOR.addChild(sequence1);
    sequence1.runAction(cc.sequence(
        cc.delayTime(passedTurn ? 0 : MOVE_TIME),
        cc.callFunc(mummyMove2),
        cc.delayTime(MOVE_TIME * 1.1),
        cc.callFunc(mummyMove2),
        cc.delayTime(mummyMoved ? MOVE_TIME : 0),
        cc.callFunc(function() {
            setMove();
            reverseButtons();
            if (arrowState && explorerPos.x == destination.x && explorerPos.y == destination.y) {
                arrowState = false;
                setMove();
                reverseButtons();
                const sequence2 = new cc.Node;
                FLOOR.addChild(sequence2);
                sequence2.runAction(cc.sequence(
                    cc.callFunc(function() {
                        switch (stairsDirection) {
                            case DIRECTION.UP: explorerMoveUp(1); break;
                            case DIRECTION.DOWN: explorerMoveDown(1); break;
                            case DIRECTION.LEFT: explorerMoveLeft(1); break;
                            case DIRECTION.RIGHT: explorerMoveRight(1); break;
                        }
                    }),
                    cc.delayTime(MOVE_TIME),
                    cc.callFunc(escape),
                    cc.removeSelf(true)
                ));
            }
            else {
                addTurn();
                keyState = !collided;
            }
        }),
        cc.removeSelf(true)
    ));
}

function mummyMove2() {
    var moved = false;
    if (mummyType == "white") {
        if (mummyPos.x > explorerPos.x && matrix[mummyPos.x][mummyPos.y].left) {
            mummyMoveLeft(mummyType);
            moved = true;
        }
        else if (mummyPos.x < explorerPos.x && matrix[mummyPos.x][mummyPos.y].right) {
            mummyMoveRight(mummyType);
            moved = true;
        }
        else if (mummyPos.y < explorerPos.y && matrix[mummyPos.x][mummyPos.y].top) {
            mummyMoveUp(mummyType);
            moved = true;
        }
        else if (mummyPos.y > explorerPos.y && matrix[mummyPos.x][mummyPos.y].bottom) {
            mummyMoveDown(mummyType);
            moved = true;
        }
    }
    else {
        if (mummyPos.y < explorerPos.y && matrix[mummyPos.x][mummyPos.y].top) {
            mummyMoveUp(mummyType);
            moved = true;
        }
        else if (mummyPos.y > explorerPos.y && matrix[mummyPos.x][mummyPos.y].bottom) {
            mummyMoveDown(mummyType);
            moved = true;
        }
        else if (mummyPos.x > explorerPos.x && matrix[mummyPos.x][mummyPos.y].left) {
            mummyMoveLeft(mummyType);
            moved = true;
        }
        else if (mummyPos.x < explorerPos.x && matrix[mummyPos.x][mummyPos.y].right) {
            mummyMoveRight(mummyType);
            moved = true;
        }
    }
    mummyMoved = moved;
    if (moved) {
        randomSound(SOUND.MUMMY, 6);
        key(mummyPos);
        if (mummyPos.x == explorerPos.x && mummyPos.y == explorerPos.y)
            collide();
    }
}

function key(position) {
    if (typeof matrix[position.x][position.y].state === "object") {
        cc.audioEngine.playEffect(SOUND.GATE);
        const gateX = matrix[position.x][position.y].state.gateX;
        const gateY = matrix[position.x][position.y].state.gateY;
        if (matrix[position.x][position.y].state.gateState == GATE_STATE.CLOSED) {
            matrix[position.x][position.y].state.gateState = GATE_STATE.OPENED;
            matrix[position.x][position.y].state.closed.setVisible(false);
            Animation("res/image/gate", 1, logicToFloor(gateX), logicToFloor(gateY, 1), FLOOR, false, matrix[position.x][position.y].state.opened);
        }
        else {
            matrix[position.x][position.y].state.gateState = GATE_STATE.CLOSED;
            matrix[position.x][position.y].state.opened.setVisible(false);
            Animation("res/image/gate", 1, logicToFloor(gateX), logicToFloor(gateY, 1), FLOOR, true, matrix[position.x][position.y].state.closed);
        }
        matrix[gateX][gateY].top = matrix[gateX][gateY + 1].bottom = !matrix[gateX][gateY].top;
    }
}

function trapped() {
    cc.audioEngine.playEffect(SOUND.DEAD);
    const sequence = new cc.Node;
    FLOOR.addChild(sequence);
    sequence.runAction(cc.sequence(
        cc.delayTime(MOVE_TIME),
        cc.callFunc(function() {
            cc.audioEngine.playEffect(SOUND.TRAP);
            explorer.setVisible(false);
            Animation("res/image/freakOut", 1, logicToFloor(explorerPos.x), logicToFloor(explorerPos.y), FLOOR);
        }),
        cc.delayTime(TIME_EPSILON * 8),
        cc.callFunc(function() {
            const explorerX = logicToFloor(explorerPos.x);
            const explorerY = logicToFloor(explorerPos.y);
            Animation("res/image/block", 1, explorerX, logicToFloor(MAZE_SIZE + 1), FLOOR, false, BLOCK).runAction(
                cc.moveTo(MOVE_TIME, explorerX, explorerY)
            );
            BLOCK.setPosition(explorerX, explorerY);
        }),
        cc.delayTime(TIME_EPSILON * 16),
        cc.callFunc(reverseButtons),
        cc.removeSelf(true)
    ));
    ankh.enabled = false;
    addTurn();
}

function collide() {
    cc.audioEngine.playEffect(SOUND.COLLIDE);
    const sequence = new cc.Node;
    FLOOR.addChild(sequence);
    sequence.runAction(cc.sequence(
        cc.delayTime(MOVE_TIME),
        cc.callFunc(function() {
            explorer.setVisible(false);
            mummy.setVisible(false);
            const explorerX = logicToFloor(mummyPos.x);
            const explorerY = logicToFloor(mummyPos.y);
            DUST.runAction(cc.fadeIn(0));
            DUST.setPosition(explorerX, explorerY);
            MUMMY_WIN.setVisible(true);
            MUMMY_WIN.setPosition(explorerX, explorerY);
        }),
        cc.delayTime(1),
        cc.callFunc(function() {
            DUST.runAction(cc.fadeOut(FADE_TIME));
        }),
        cc.removeSelf(true)
    ));
    ankh.enabled = false;
    arrowState = false;
    collided = true;
}

var mummyMoved = true, passedTurn, collided = false;