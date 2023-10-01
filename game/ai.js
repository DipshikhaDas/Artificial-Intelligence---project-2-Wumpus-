let aiBoardVisited = [];
let aiPitScore = [];
let aiWumpusScore = [];
let aiGoldScore = [];
let aiEvaluated = [];
let safetyCells = [];

// let priorityQueue = new PriorityQueue();

// -1 means safe
// 0 means undiscovered
// greater than zero means level of threat.
// mark all visited cells safe.

function resetAiScore() {
  aiBoardVisited = [];
  aiPitScore = [];
  aiWumpusScore = [];
  aiEvaluated = [];
  safetyCells = [];

  for (let row = 0; row < board._maxRows; row++) {
    aiBoardVisited.push([]);
    aiPitScore.push([]);
    aiWumpusScore.push([]);
    aiEvaluated.push([]);
    for (let col = 0; col < board._maxCols; col++) {
      aiBoardVisited[row].push(false);
      aiEvaluated[row].push(false);
      aiPitScore[row].push(0);
      aiWumpusScore[row].push(0);
    }
  }
}

function evaluateWumpusPossibility(prevRow, prevCol, row, col) {
  let foundStench = false;
  let coveredCnt = 0;
  let validCells = 0;

  if (aiWumpusScore[row][col] == -1) {
    return;
  }
  for (const dir of direction) {
    const newRow = row + dir.row;
    const newCol = col + dir.col;

    if (newRow === prevRow && newCol === prevCol) {
      continue;
    }
    if (board.isInBoard(newRow, newCol)) {
      validCells++;
      newCell = board._board[newRow][newCol];
      if (newCell.discovered === false) {
        coveredCnt++;
        continue;
      }
      if (newCell.stench === false) {
        aiWumpusScore[row][col] = -1;
        foundStench = false;
        break;
      }
      if (newCell.stench) {
        foundStench = true;
      }
    }
  }

  if (foundStench || validCells === coveredCnt) aiWumpusScore[row][col] += 10;
}

function evaluatePitPossibility(prevRow, prevCol, row, col) {
  let foundBreeze = false;
  let coveredCnt = 0;
  let validCells = 0;

  if (aiPitScore[row][col] == -1) {
    return;
  }
  for (const dir of direction) {
    const newRow = row + dir.row;
    const newCol = col + dir.col;

    if (newRow === prevRow && newCol === prevCol) {
      continue;
    }
    if (board.isInBoard(newRow, newCol)) {
      validCells++;
      newCell = board._board[newRow][newCol];
      if (newCell.discovered === false) {
        coveredCnt++;
        continue;
      }
      if (newCell.breeze === false) {
        aiPitScore[row][col] = -1;
        foundBreeze = false;
        break;
      }
      if (newCell.breeze) {
        foundBreeze = true;
      }
    }
  }

  if (foundBreeze || validCells === coveredCnt) aiPitScore[row][col] += 1;
}

function evaluateVisitedCells(curRow, curCol, prevRow, prevCol) {
  if (!board.isInBoard(curRow, curCol)) {
    return;
  }
  if (aiEvaluated[curRow][curCol]) {
    return;
  }
  if (board._board[curRow][curCol].discovered === false) {
    const prevCell = board._board[prevRow][prevCol];
    if (!prevCell.breeze && !prevCell.stench) {
      aiPitScore[curRow][curCol] = 0;
      aiWumpusScore[curRow][curCol] = 0;
    }
    if (prevCell.breeze) {
      evaluatePitPossibility(prevRow, prevCol, curRow, curCol);
    }
    if (prevCell.stench) {
      evaluateWumpusPossibility(prevRow, prevCol, curRow, curCol);
    }
    // aiEvaluated[curRow][curCol] = true;
    safetyCells.push({
      row: curRow,
      col: curCol,
      score: 0 + aiPitScore[curRow][curCol] + aiWumpusScore[curRow][curCol],
    });
    return;
  }

  aiEvaluated[curRow][curCol] = true;
  for (const dir of direction) {
    const newRow = curRow + dir.row;
    const newCol = curCol + dir.col;
    evaluateVisitedCells(newRow, newCol, curRow, curCol);
  }
  return;
}
function initAiPlayer() {
  resetAiScore();
  evaluateVisitedCells(0, 1, 0, 0);
}

function discoverCellInBoard(row, col) {
  const cell = board._board[row][col];
  if (!cell.discovered) {
    cell.discovered = true;
  }
}

function bfs(finalRow, finalCol) {
  let path = [];
  let parent = [];
  let visited = [];
  let found_goal = false;
  for (let row = 0; row < board._maxRows; row++) {
    visited.push([]);
    parent.push([]);
    for (let col = 0; col < board._maxCols; col++) {
      visited[row].push(false);
      parent[row].push(null);
    }
  }
  visited[playerPosition.row][playerPosition.col] = true;

  let queue = new Queue();
  queue.enqueue(playerPosition);

  while (!queue.isEmpty() && !found_goal) {
    const pos = queue.dequeue();
    for (const dir of direction) {
      const newRow = pos.row + dir.row;
      const newCol = pos.col + dir.col;

      if (board.isInBoard(newRow, newCol)) {
        if (!visited[newRow][newCol]) {
          visited[newRow][newCol] = true;
          // console.log(newRow, newCol);

          if (newRow === finalRow && newCol === finalCol) {
            found_goal = true;
            queue.enqueue({ row: newRow, col: newCol });
            parent[newRow][newCol] = pos;
            break;
          }
          if (board._board[newRow][newCol].discovered) {
            queue.enqueue({ row: newRow, col: newCol });
            parent[newRow][newCol] = pos;
          }
        }
      }
    }
  }

  if (found_goal) {
    let current = { row: finalRow, col: finalCol };
    while (current) {
      path.unshift(current); // Add the current cell to the beginning of the path
      current = parent[current.row][current.col]; // Move to the parent cell
    }
    return path;
  } else {
    console.log("Path not found.");
  }
}

async function killWumpus() {
	return new Promise(async (resolve, reject) => {
		if (board.arrow_count <= 0) {
			console.log("returning, no arrow");
      resolve();
      return;
    }
    let probable_wumpus_cells = [];
		
    for (let row = 0; row < board._maxRows; row++) {
			for (let col = 0; col < board._maxCols; col++) {
				if (aiWumpusScore[row][col] >= 20) {
					console.log("adf");
          probable_wumpus_cells.push({ row: row, col: col });
        }
      }
    }

    if (probable_wumpus_cells.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * probable_wumpus_cells.length
      );
      const selectedCell = probable_wumpus_cells[randomIndex];
      let goToTarget = null;
      for (const dir of direction) {
        const newRow = selectedCell.row + dir.row;
        const newCol = selectedCell.col + dir.col;

        if (
          board.isInBoard(newRow, newCol) &&
          board._board[newRow][newCol].discovered
        ) {
          goToTarget = { row: newRow, col: newCol };
          break;
        }
      }
      if (goToTarget) {
        console.log("going to target");
        path = bfs(goToTarget.row, goToTarget.col);
        for (const p of path) {
          await new Promise((resolve) => setTimeout(resolve, 200));
          updatePlayerPosition(p.row, p.col);
        }

        board.arrow_count--;
				playerScore -= 10;
        console.log("You shot an arrow");
        if (board._board[selectedCell.row][selectedCell.col].wumpus) {
          alert("You have killed a wumpus");
          console.log("You have killed a wumpus");
          board._board[selectedCell.row][selectedCell.col].wumpus = false;
          board.add_stench();
          changeCellAfterWumpusKill(selectedCell.row, selectedCell.col);
          for (const dir of direction) {
            const newRow = selectedCell.row + dir.row;
            const newCol = selectedCell.col + dir.col;

            if (board.isInBoard(newRow, newCol)) {
              changeCellAfterWumpusKill(newRow, newCol);
            }
          }
        } else {
          alert("You have missed the wumpus");
          console.log("You have missed the wumpus");
        }
      }
    }
    resolve();
  });
}

async function aiMove() {
  while (!game_over) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    resetAiScore();
    // console.log("Evaluate board");
    evaluateVisitedCells(0, 1, 0, 0);

    await killWumpus();
    //  console.log(safetyCells);

    safetyCells.sort((a, b) => {
      return a.score - b.score;
    });

    let lowest_scores = [];

    lowest_scores.push(safetyCells[0]);

    for (let i = 1; i < safetyCells.length; i++) {
      if (safetyCells[i].score > safetyCells[0].score) {
        break;
      }
      lowest_scores.push(safetyCells[i]);
    }
    // console.log(lowest_scores);
    if (lowest_scores.length > 0) {
      const randomIndex = Math.floor(Math.random() * lowest_scores.length);
      const selectedCell = lowest_scores[randomIndex];

      const path = bfs(selectedCell.row, selectedCell.col);
      for (const p of path) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        updatePlayerPosition(p.row, p.col);
      }
      // updatePlayerPosition(selectedCell.row, selectedCell.col);
    }
  }
}
initAiPlayer();
