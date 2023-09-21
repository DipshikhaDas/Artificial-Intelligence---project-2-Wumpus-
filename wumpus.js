  const gameBoard = document.querySelector("#gameboard");
  const playerDisplay = document.querySelector("#pieces");
  const infoDisplay = document.querySelector("#info-display");

  // const wumpusWorld = Array(10)
  //   .fill(null)
  //   .map(() => Array(10).fill("")); // Initialize an empty 10x10 grid

  // Define symbols for different elements in the Wumpus world
  const EMPTY = "";
  const WUMPUS = "...";
  const PIT = "..";
  const PLAYER = ".";
  const TREASURE = ",";

  // Place the Wumpus, pits, and player in the world
  // wumpusWorld[2][3] = WUMPUS;
  // wumpusWorld[5][8] = PIT;
  // wumpusWorld[7][1] = PIT;
  // wumpusWorld[0][0] = PLAYER;
  // wumpusWorld[4][6] = TREASURE;

  const elements = [
    { symbol: WUMPUS, count: 1 }, 
    { symbol: TREASURE, count: 1 }, 
    { symbol: PIT, count: 3 }, 
    { symbol: EMPTY, count: 95 }, // The rest are empty cells
  ];

  function shuffleElements(elements) {
    let shuffled = [];
    elements.forEach((element) => {
      for (let i = 0; i < element.count; i++) {
        shuffled.push(element.symbol);
      }
    });
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Shuffle the elements and assign them to the wumpusWorld array
  const shuffledElements = shuffleElements(elements);

  const wumpusWorld = Array(10)
    .fill(null)
    .map(() => Array(10).fill(""));

  wumpusWorld[0][0] = PLAYER;
  let index = 0;
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      if(row === 0 && col === 0){
        wumpusWorld[row][col] = PLAYER;
      }
      else{
      wumpusWorld[row][col] = shuffledElements[index++];
      }
    }
  }

  function createBoard() {
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const square = document.createElement("div");
        // square.setAttribute("draggable", "true");
        square.setAttribute("row-id", row);
        square.setAttribute("col-id", col);
        square.classList.add("square");

        // Add class based on the content of the cell (Wumpus, Pit, Player, or Empty)
        if (wumpusWorld[row][col] === WUMPUS) {
          // square.classList.add("wumpus");
          square.style.backgroundImage = 'url("dragon.jpg")';
          square.style.backgroundSize = "100% 100%";
        } else if (wumpusWorld[row][col] === PIT) {
          square.classList.add("pit");
          square.style.backgroundImage = 'url("pits.jpg")';
          square.style.backgroundSize = "100% 100%";
        } else if (wumpusWorld[row][col] === PLAYER) {
          square.classList.add("player");
          square.style.backgroundImage = 'url("gokuu.jpg")';
          square.style.backgroundSize = "100% 100%";
        } else if (wumpusWorld[row][col] === TREASURE) {
          square.classList.add("treasure");
          square.style.backgroundImage = 'url("goldenBalls.jpg")';
          square.style.backgroundSize = "100% 100%";
        }

        square.innerHTML = wumpusWorld[row][col];
        gameBoard.append(square);
      }
    }
  }

  createBoard();
