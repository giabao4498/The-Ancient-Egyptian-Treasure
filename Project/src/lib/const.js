var CENTER_X, CENTER_Y;
const TIME_EPSILON = 0.05;
const MENU_BACKGROUND = "res/image/menuBackground.png";
const FONT_12 = "res/font/soji_12.fnt";
const FONT_16 = "res/font/soji_16.fnt";
const FONT_20 = "res/font/soji_20.fnt";
const FONT_24 = "res/font/soji_24.fnt";
const BUTTON_1 = "res/image/button_1.png";
const BACKDROP = "res/image/backdrop.jpg";
const FLOOR_IMAGE = "res/image/map.jpg";
const CONTROL_BOARD = "res/image/controlBoard.png";
const UP_BUTTON = "res/image/arrow_up.png";
const DOWN_BUTTON = "res/image/arrow_down.png";
const LEFT_BUTTON = "res/image/arrow_left.png";
const RIGHT_BUTTON = "res/image/arrow_right.png";
const CIRCLE = "res/image/circle.png";
const TORCH = "res/image/torch.png";
const FLAME = "res/image/flame";
const TILE_SIZE = 60;
const MAZE_SIZE = 6;
const MOVE_TIME = TIME_EPSILON * 10;
const EXPLORER_UP_IMAGE = "res/image/explorer_up_0.png";
const EXPLORER_DOWN_IMAGE = "res/image/explorer_down_0.png";
const EXPLORER_LEFT_IMAGE = "res/image/explorer_left_0.png";
const EXPLORER_RIGHT_IMAGE = "res/image/explorer_right_0.png";
const MUMMY_UP_IMAGE = {
    white: "res/image/whiteMummy_up_0.png",
    red: "res/image/redMummy_up_0.png"
};
const MUMMY_DOWN_IMAGE = {
    white: "res/image/whiteMummy_down_0.png",
    red: "res/image/redMummy_down_0.png"
};
const MUMMY_LEFT_IMAGE = {
    white: "res/image/whiteMummy_left_0.png",
    red: "res/image/redMummy_left_0.png"
};
const MUMMY_RIGHT_IMAGE = {
    white: "res/image/whiteMummy_right_0.png",
    red: "res/image/redMummy_right_0.png"
};
const TRAP_ID = true;
const EMPTY_ID = false;
const TRAP = "res/image/trap.png";
const KEY = "res/image/key";
const GATE_CLOSED = "res/image/gate_0.png";
const GATE_OPENED = "res/image/gate_7.png";
const WALL_HORIZONTAL = "res/image/wall_horizontal.png";
const WALL_VERTICAL_0 = "res/image/wall_vertical_0.png";
const WALL_VERTICAL_1 = "res/image/wall_vertical_1.png";
const STAIRS_TOP = "res/image/stairs_top.png";
const STAIRS_BOTTOM = "res/image/stairs_bottom.png";
const STAIRS_LEFT = "res/image/stairs_left.png";
const STAIRS_RIGHT = "res/image/stairs_right.png";
const Z_ORDER = {
    TRAP: 0,
    STAIRS: 0,
    KEY: 1,
    GATE_OPENED: 1,
    MUMMY: 2,
    DUST: 3,
    EXPLORER: 3,
    GATE_CLOSED: 4,
    WALL: 4,
    BLACK: 5,
    BLOCK: 5,
    EXPLORER_START: 6
};
const GATE_STATE = {
    CLOSED: false,
    OPENED: true
};
const BLOCK_IMAGE = "res/image/block_15.png";
const MUMMY_WIN_IMAGE = {
    white: "res/image/whiteMummyWin.png",
    red: "res/image/redMummyWin.png"
};
const UNDO_MOVE = "res/image/undoMove.jpg";
const RESET_MAZE = "res/image/resetMaze.jpg";
const QUIT_TO_MAIN = "res/image/quitToMain.jpg";
const MAP = "res/image/map.png";
const DIRECTION = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3
};
const FADE_TIME = 0.5;
const NEXT_LEVEL_IMAGE = "res/image/nextLevel.jpg";
const BUTTON_2 = "res/image/button_2.jpg";
const MAX_LEVEL = 15;
const FIRST_LEVEL = 1;
const CHEST = "res/image/chest.png";
const WINNING = "res/image/winning.png";
const KEY_CODE = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    SPACE: 32
};
const ANKH = "res/image/ankh.png";
const HEAD = "res/image/head.png";
const CROSS = "res/image/cross.png";
const LEVEL = {
    A: {x: 25, y: 12},
    B: {x: 50, y: 12},
    C: {x: 75, y: 12},
    D: {x: 100, y: 12},
    E: {x: 125, y: 12},
    F: {x: 113, y: 31},
    G: {x: 88, y: 31},
    H: {x: 63, y: 31},
    I: {x: 38, y: 31},
    J: {x: 50, y: 50},
    K: {x: 75, y: 50},
    L: {x: 100, y: 50},
    M: {x: 88, y: 69},
    N: {x: 63, y: 69},
    O: {x: 75, y: 88}
};
const TUTORIAL = "res/image/tutorial.png";
const BACKGROUND = "res/image/background.jpg";
const CLOSE = "res/image/close.png";
const RESET_DATA = "res/image/resetData.png";
const BUTTON_3 = "res/image/button_3.png";
const SOUND = {
    CLICK: "res/sound/click.mp3",
    COLLIDE: "res/sound/collide.mp3",
    DEAD: "res/sound/dead.mp3",
    ESCAPE: "res/sound/escape",
    EXPLORER: "res/sound/explorer",
    GATE: "res/sound/gate.mp3",
    MUMMY: "res/sound/mummy",
    MUMMY_HOWL: "res/sound/mummyHowl.mp3",
    OPEN_TREASURE: "res/sound/openTreasure.mp3",
    TRAP: "res/sound/trap.mp3",
    MAZE: "res/sound/maze.mp3",
    MENU: "res/sound/menu.mp3",
    WINNING: "res/sound/winning"
};
const STORY = "res/image/story.png";
const TITLE = "res/image/title.png";