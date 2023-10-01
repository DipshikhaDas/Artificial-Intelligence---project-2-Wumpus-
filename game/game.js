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
  discovered = false;
  empty = true;
  wumpus = false;
  player = false;
  breeze = false;
  pit = false;
  stench = false;
  gold = false;
  glitter = false;
}

const direction = [
  { row: +1, col: 0 },
  { row: -1, col: 0 },
  { row: 0, col: +1 },
  { row: 0, col: -1 },
];

const PROB_VAL = 0.005;
class GameBoard {
  constructor() {
    this._maxRows = 10;
    this._maxCols = 10;
    this._board = [];
    this._wumpus_count = 1;
    this._pit_count = 10;
    this._max_golds = 5;
    this._gold_count = this._max_golds;
    this.arrow_count = 1;

    for (let row = 0; row < this._maxRows; row++) {
      this._board.push([]);
      for (let col = 0; col < this._maxCols; col++) {
        this._board[row].push(null);
        this._board[row][col] = new Cell();
        if (this._ignore_cell(row, col)) {
          this._board[row][col].discovered = true;
        }
      }
    }
    this._add_gold();
    this._add_wumpus();
    this._add_pits();
    this._add_player();
  }

  _add_player() {
    this._board[0][0].player = true;
  }
  _add_wumpus() {
    let wumpus_locations = [];
    while (this._wumpus_count > 0) {
      for (let row = 0; row < this._maxRows; row++) {
        for (let col = 0; col < this._maxCols; col++) {
          if (this._ignore_cell(row, col)) {
            continue;
          }
          if (this._board[row][col].empty === false) {
            continue;
          }
          const prob = Math.random();
          if (prob < PROB_VAL) {
            this._wumpus_count--;
            // console.log("Wumpus Added", row, col);
            this._board[row][col].wumpus = true;
            this._board[row][col].empty = false;

            wumpus_locations.push({
              row: row,
              col: col,
            });

            break;
          }
        }
        if (this._wumpus_count <= 0) {
          break;
        }
      }
    }

    // adding the stench
    for (const loc of wumpus_locations) {
      for (const dir of direction) {
        let new_row = loc.row + dir.row;
        let new_col = loc.col + dir.col;

        if (this.isInBoard(new_row, new_col)) {
          this._board[new_row][new_col].stench = true;
        }
      }
    }
  }

  _add_gold() {
    let gold_locations = [];

    while (this._gold_count > 0) {
      for (let row = 0; row < this._maxRows; row++) {
        for (let col = 0; col < this._maxCols; col++) {
          if (this._ignore_cell(row, col)) {
            continue;
          }
          const prob = Math.random();
          if (prob < PROB_VAL) {
            this._gold_count--;
            // console.log("Gold Added", row, col);
            gold_locations.push({ row: row, col: col });
            this._board[row][col].gold = true;
            this._board[row][col].glitter = true;
            this._board[row][col].empty = false;
            break;
          }
        }
        if (this._gold_count <= 0) {
          break;
        }
      }
    }
  }

  take_gold(row, col) {
    const cell = this._board[row][col];
    cell.gold = false;
    cell.glitter = false;
  }
  _add_pits() {
    let pit_locations = [];

    while (this._pit_count > 0) {
      for (let row = 0; row < this._maxRows; row++) {
        for (let col = 0; col < this._maxCols; col++) {
          if (this._ignore_cell(row, col)) {
            continue;
          }

          if (this._board[row][col].empty === false) {
            continue;
          }
          const prob = Math.random();
          if (prob < PROB_VAL) {
            this._pit_count--;
            // console.log("Pit Added", row, col);
            this._board[row][col].pit = true;
            this._board[row][col].empty = false;
            this._board[row][col].stench = false;

            pit_locations.push({
              row: row,
              col: col,
            });

            break;
          }
        }
        if (this._pit_count <= 0) {
          break;
        }
      }
    }

    for (const loc of pit_locations) {
      for (const dir of direction) {
        let new_row = loc.row + dir.row;
        let new_col = loc.col + dir.col;

        if (
          this.isInBoard(new_row, new_col) &&
          this._board[new_row][new_col].wumpus === false &&
          this._board[new_row][new_col].pit === false
        ) {
          this._board[new_row][new_col].breeze = true;
        }
      }
    }
  }
  isInBoard(row, col) {
    if (0 <= row && row < this._maxRows && 0 <= col && col < this._maxCols) {
      return true;
    } else {
      return false;
    }
  }
  _ignore_cell(row, col) {
    if (0 <= row && row < 2 && 0 <= col && col < 2) {
      return true;
    } else {
      return false;
    }
  }
}

const board = new GameBoard();
