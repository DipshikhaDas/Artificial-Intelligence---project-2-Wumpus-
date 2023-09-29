const gameBoard = document.querySelector("#gameboard");
const playerDisplay = document.querySelector("#pieces");
const infoDisplay = document.querySelector("#info-display");

let playerPosition = { row: 0, col: 0 };

function createGameBoard() {
  for (let row = 0; row < board._maxRows; row++) {
    for (let col = 0; col < board._maxCols; col++) {
      const square = document.createElement("div");
      square.setAttribute("row-id", row);
      square.setAttribute("col-id", col);
      square.classList.add("square");

      // Add class based on the content of the cell (Wumpus, Pit, Player, or Empty)
      if (board._board[row][col].wumpus === true) {
        square.classList.add("wumpus");
      } else if (board._board[row][col].pit === true) {
        square.classList.add("pit");
      } else if (board._board[row][col].gold === true) {
        square.classList.add("gold");
      } else if (board._board[row][col].player === true) {
        square.classList.add("player");
      } else {
        // square.classList.add(row % 2 === col % 2 ? "gray" : "green");
      }

      // square.innerHTML = board._board[row][col];
      gameBoard.append(square);
    }
  }
}

function updateInfoDisplay(row, col) {
  infoDisplay.innerHTML = "";
  cell = board._board[row][col];

  if (cell.stench) {
    infoDisplay.innerHTML += "You smell a stench <br>";
  }
  if (cell.breeze) {
    infoDisplay.innerHTML += "You feel a breeze <br>";
  }
}

function updatePlayerPosition(newRow, newCol) {
  const prevPlayerSquare = gameBoard.querySelector(".square.player");
  prevPlayerSquare.classList.remove("player");

  playerPosition.row = newRow;
  playerPosition.col = newCol;

  const newPlayerSquare = gameBoard.querySelector(
    `.square[row-id="${newRow}"][col-id="${newCol}"]`
  );
  newPlayerSquare.classList.add("player");
  updateInfoDisplay(newRow, newCol);
}

function handleArrowKey(key) {
  let newRow = playerPosition.row;
  let newCol = playerPosition.col;

  if (key === "ArrowLeft" && newCol > 0) {
    newCol--;
  } else if (key === "ArrowUp" && newRow > 0) {
    newRow--;
  } else if (key === "ArrowRight" && newCol < board._maxCols - 1) {
    newCol++;
  } else if (key === "ArrowDown" && newRow < board._maxRows - 1) {
    newRow++;
  }

  updatePlayerPosition(newRow, newCol);
}

document.addEventListener("keydown", (event) => {
  handleArrowKey(event.key);
  event.preventDefault(); // Prevent default arrow key behavior (scrolling)
});

createGameBoard();
