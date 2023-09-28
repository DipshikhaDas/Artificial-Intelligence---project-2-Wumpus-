const CELL_CONTENT = {
  EMPTY: 0,
  WUMPUS: 1,
  PLAYER: 2,
  BREEZE: 3,
  PIT: 4,
  STENCH: 5,
  ARROW: 6,
};

class Cell {
  empty = true;
  wumpus = false;
  player = false;
  breeze = false;
  pit = false;
  stench = false;
};

const direction = [
	{row: +1, col: 0},
	{row: -1, col: 0},
	{row: 0, col: +1},
	{row: 0, col: -1},
];

class GameBoard {
  constructor() {
    this._maxRows = 10;
    this._maxCols = 10;
    this._board = [];
    this._wumpus_count = 1;
    this._pit_count = 10;

    for (let row = 0; row < this._maxRows; row++) {
			this._board.push([]);
      for (let col = 0; col < this._maxCols; col++) {
        this._board[row].push(null);
				this._board[row][col] = new Cell();
      }
    }
		this._add_wumpus();
  }

  _add_wumpus() {
    while (this._wumpus_count > 0) {
      for (let row = 0; row < this._maxRows; row++) {
        for (let col = 0; col < this._maxCols; col++) {
					const prob = Math.random();
					if (prob < 0.05) {
						this._wumpus_count--;
						console.log("Wumpus Added", row, col);
						this._board[row][col].wumpus = true;
						this._board[row][col].empty = false;
						break;
					}
        }
				if (this._wumpus_count <= 0) {
					break;
				}
      }
    }
  }

	isInBoard(row, col) {
		if (0 <= row && row < this._maxRows && 0 <= col && col < this._maxCols){
			return true;
		}
		else {
			return false;
		}
	}
	
}

const board = new GameBoard();