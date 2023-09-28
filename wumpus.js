const gameBoard = document.querySelector("#gameboard");
const playerDisplay = document.querySelector("#pieces");
const infoDisplay = document.querySelector("#info-display");

const wumpusWorld = Array(10)
  .fill(null)
  .map(() => Array(10).fill("")); // Initialize an empty 10x10 grid

// Define symbols for different elements in the Wumpus world
const EMPTY = "";
const WUMPUS = "W";
const PIT = "P";
const PLAYER = "H";

// Place the Wumpus, pits, and player in the world
wumpusWorld[2][3] = WUMPUS; // Example: Wumpus at row 2, column 3
wumpusWorld[5][8] = PIT;   // Example: Pit at row 5, column 8
wumpusWorld[7][1] = PIT;   // Example: Pit at row 7, column 1
wumpusWorld[0][0] = PLAYER; // Example: Player at row 0, column 0

function createBoard() {
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const square = document.createElement("div");
      square.setAttribute("draggable", "true");
      square.setAttribute("row-id", row);
      square.setAttribute("col-id", col);
      square.classList.add("square");

      // Add class based on the content of the cell (Wumpus, Pit, Player, or Empty)
      if (wumpusWorld[row][col] === WUMPUS) {
        square.classList.add("wumpus");
      } else if (wumpusWorld[row][col] === PIT) {
        square.classList.add("pit");
      } else if (wumpusWorld[row][col] === PLAYER) {
        square.classList.add("player");
      } else {
        // square.classList.add(row % 2 === col % 2 ? "gray" : "green");
      }

      square.innerHTML = wumpusWorld[row][col];
      gameBoard.append(square);
    }
  }
}

createBoard();

// let gameBoard2 = new GameBoard();


