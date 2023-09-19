const CELL_CONTENT = {
    EMPTY: 0,
    WUMPUS: 1,
    PLAYER: 2,
    BREEZE: 3,
    PIT: 4,
    STENCH: 5,
    ARROW: 6,
};

class GameBoard {
    constructor() {
        this._maxRows = 10;
        this._maxCols = 10;
        this._board = [];
    }
}