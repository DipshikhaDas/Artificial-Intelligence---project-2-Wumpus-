const gameBoard = document.querySelector("#gameboard");
const playerDisplay = document.querySelector("#pieces");
const infoDisplay = document.querySelector("#info-display");
const playerPoints = document.querySelector("#player-score");

let playerPosition = { row: 0, col: 0 };
let game_over = false;
let playerScore = 0;

function addPlayerImg(row, col) {
  const square = gameBoard.querySelector(`[row-id="${row}"][col-id="${col}"]`);
  const playerImg = document.createElement("img");

  playerImg.src = "player.png";
  playerImg.alt = "player";
  playerImg.style.maxWidth = "100%";
  playerImg.style.maxHeight = "100%";

  square.appendChild(playerImg);
}

function changeCellAfterWumpusKill(row, col) {
  const cell = board._board[row][col];
  if (cell.discovered === false) {
    return;
  }
  const square = gameBoard.querySelector(`[row-id="${row}"][col-id="${col}"]`);

  square.classList.add("square");
  square.innerHTML = "";
  if (!(playerPosition.row == row && playerPosition.col == col)) {
    if (board._board[row][col].breeze === true) {
      square.innerHTML += "Breeze <br>";
    }
    if (board._board[row][col].stench === true) {
      square.innerHTML += "Stench <br>";
    }
  }
}

function discoverCell(row, col) {
  cell = board._board[row][col];
  cell.discovered = true;
  cell.player = true;

  const square = gameBoard.querySelector(`[row-id="${row}"][col-id="${col}"]`);

  square.classList.add("square");

  if (board._board[row][col].wumpus === true) {
    square.classList.add("wumpus");
  } else if (board._board[row][col].pit === true) {
    square.classList.add("pit");
  } else if (board._board[row][col].gold === true) {
    square.classList.add("gold");
  }
  square.innerHTML = "";
  if (!(playerPosition.row == row && playerPosition.col == col)) {
    if (board._board[row][col].breeze === true) {
      square.innerHTML += "Breeze <br>";
    }
    if (board._board[row][col].stench === true) {
      square.innerHTML += "Stench <br>";
    }
  }
}

function createGameBoard() {
  for (let row = 0; row < board._maxRows; row++) {
    for (let col = 0; col < board._maxCols; col++) {
      const square = document.createElement("div");
      square.setAttribute("row-id", row);
      square.setAttribute("col-id", col);

      if (board._board[row][col].discovered == true) {
        square.classList.add("square");
        if (row == 0 && col == 0) {
          square.classList.add("player");
        }
      } else {
        square.classList.add("covered");
      }
      // Add class based on the content of the cell (Wumpus, Pit, Player, or Empty)

      // square.innerHTML = board._board[row][col];
      gameBoard.append(square);
    }
  }
  addPlayerImg(0, 0);
}

function updateInfoDisplay(row, col) {
  infoDisplay.innerHTML = "";
  cell = board._board[row][col];

  playerScore--;
  if (cell.stench) {
    infoDisplay.innerHTML += "You smell a stench <br>";
  }
  if (cell.breeze) {
    infoDisplay.innerHTML += "You feel a breeze <br>";
  }
  if (cell.glitter) {
    infoDisplay.innerHTML += "You see glitter";
    const square = gameBoard.querySelector(
      `[row-id="${row}"][col-id="${col}"]`
    );
    square.classList.remove("gold");
    board.take_gold(row, col);
    playerScore += 1000;
    alert("You have taken a gold");
  }
  if (cell.wumpus) {
    playerScore -= 1000;
    game_over = true;
    alert("Game over!!! You have been eaten by the Wumpus");
  }
  if (cell.pit) {
    playerScore -= 1000;
    game_over = true;
    alert("Game over!!! You fell into a Pit");
  }
  playerPoints.innerHTML = `Player Score: ${playerScore}`;
}

function updatePlayerPosition(newRow, newCol) {
  const prevPlayerSquare = gameBoard.querySelector(".player");
  const prevPlayerImage = gameBoard.querySelector("img");

  if (prevPlayerImage) {
    prevPlayerImage.remove();
  }

  prevPlayerSquare.classList.remove("player");

  const newPlayerSquare = gameBoard.querySelector(
    `[row-id="${newRow}"][col-id="${newCol}"]`
  );

  // console.log(newPlayerSquare);

  newPlayerSquare.classList.remove("covered");

  const playerOldRow = playerPosition.row;
  const playerOldCol = playerPosition.col;

  playerPosition.row = newRow;
  playerPosition.col = newCol;
  // console.log(playerOldRow, playerOldCol, playerPosition);

  discoverCell(newRow, newCol);
  discoverCell(playerOldRow, playerOldCol);

  newPlayerSquare.classList.add("player");

  addPlayerImg(newRow, newCol);

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
