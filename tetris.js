const gameBoard = document.getElementById('game-board');
const blockSize = 30; // blocks are 30x30px
const boardWidth = 10; // the board is 10 blocks wide
const boardHeight = 20; // the board is 20 blocks tall

// game state
let currentPiece = null;
let board = [];
let gameOver = false;
let interval = null;
let score = 0; // score variable
let highScore = 0; // high score variable

// game speed
const gameSpeed = 500; // 500ms per move

// Tetris pieces
const pieces = [
  // I
  [[1, 0], [2, 0], [3, 0], [4, 0]],
  // J
  [[0, 0], [1, 0], [2, 0], [2, 1]],
  // L
  [[0, 1], [1, 1], [2, 1], [2, 0]],
  // O
  [[0, 0], [1, 0], [0, 1], [1, 1]],
  // S
  [[1, 0], [2, 0], [0, 1], [1, 1]],
  // T
  [[1, 0], [0, 1], [1, 1], [2, 1]],
  // Z
  [[0, 0], [1, 0], [1, 1], [2, 1]],
];

function startGame() {
  board = Array(boardHeight).fill().map(() => Array(boardWidth).fill(0));
  currentPiece = createPiece();
  gameOver = false;
  score = 0; // reset the score when the game starts
  draw();
}

function draw() {
  // clear board
  gameBoard.innerHTML = '';

  // draw piece
  for (let [x, y] of currentPiece.blocks) {
    let div = document.createElement('div');
    div.classList.add('cell');
    div.style.left = `${(currentPiece.x + x) * blockSize}px`;
    div.style.top = `${(currentPiece.y + y) * blockSize}px`;
    gameBoard.appendChild(div);
  }

  // draw placed blocks
  for (let y = 0; y < boardHeight; y++) {
    for (let x = 0; x < boardWidth; x++) {
      if (board[y][x] === 1) {
        let div = document.createElement('div');
        div.classList.add('cell');
        div.style.left = `${x * blockSize}px`;
        div.style.top = `${y * blockSize}px`;
        gameBoard.appendChild(div);
      }
    }
  }
}

function createPiece() {
  let piece = pieces[Math.floor(Math.random() * pieces.length)];
  return {
    x: 5, // start in middle of board
    y: 0, // start at top of board
    blocks: piece,
  };
}

// start the game when the page loads
startGame();
interval = setInterval(gameLoop, gameSpeed);

document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowRight') {
    movePiece(1, 0);
  } else if (e.key === 'ArrowLeft') {
    movePiece(-1, 0);
  } else if (e.key === 'ArrowDown') {
    movePiece(0, 1);
  } else if (e.key === 'ArrowUp') {
    rotatePiece();
  }
  draw();
});

function movePiece(dx, dy) {
  if (isMoveValid(dx, dy)) {
    currentPiece.x += dx;
    currentPiece.y += dy;
  }
}

function isMoveValid(dx, dy) {
  for (let [x, y] of currentPiece.blocks) {
    let newX = currentPiece.x + x + dx;
    let newY = currentPiece.y + y + dy;

    if (newX < 0 || newX >= boardWidth || newY < 0 || newY >= boardHeight || board[newY][newX] === 1) {
      return false;
    }
  }

  return true;
}

function rotatePiece() {
  let newBlocks = currentPiece.blocks.map(([x, y]) => [y, -x]);

  // check if rotation is valid
  for (let [x, y] of newBlocks) {
    let newX = currentPiece.x + x;
    let newY = currentPiece.y + y;

    if (newX < 0 || newX >= boardWidth || newY < 0 || newY >= boardHeight || board[newY][newX] === 1) {
      return; // invalid rotation
    }
  }

  // perform rotation
  currentPiece.blocks = newBlocks;
}

function gameLoop() {
  if (!gameOver) {
    if (!isMoveValid(0, 1)) {
      placePiece();
      clearLines();
      currentPiece = createPiece();
      if (!isMoveValid(0, 0)) {
        // new piece can't be placed, game over
        gameOver = true;
        clearInterval(interval);
        if (score > highScore) {
          highScore = score;
          document.getElementById('high-score').innerText = "High Score: " + highScore;
        }
        alert("Game Over! Your score is " + score);
        return;
      }
    }
    movePiece(0, 1);
    draw();
    document.getElementById('current-score').innerText = "Score: " + score;
    if (score > highScore) {
      highScore = score;
      document.getElementById('high-score').innerText = "High Score: " + highScore;
    }
  }
}

function placePiece() {
  for (let [x, y] of currentPiece.blocks) {
    let newX = currentPiece.x + x;
    let newY = currentPiece.y + y;
    board[newY][newX] = 1;
  }
}

function clearLines() {
  for (let y = 0; y < boardHeight; y++) {
    if (board[y].every(cell => cell === 1)) {
      // this row is full, remove it
      board.splice(y, 1);
      // add a new empty row at the top
      board.unshift(Array(boardWidth).fill(0));
      score++; // increase the score when a line is cleared
    }
  }
}
