// Set the canvas size to match the screen element dimensions
var canvas = document.getElementById('canvas_id');
var screen = document.querySelector('.screen');
// Retrieve the computed width and height of the screen, subtracting any borders
var computedStyle = getComputedStyle(screen);
var screenWidth = parseInt(computedStyle.width);
var screenHeight = parseInt(computedStyle.height);

// Set the actual width and height properties of the canvas element
canvas.width = screenWidth;
canvas.height = screenHeight;

// Update the game logic based on the new canvas size: block size and count
var BLOCK_SIZE = screenWidth / 20; // E.g., for a grid of 20 blocks
var BLOCK_COUNT = 20;

var gameInterval;
var snack;
var apple;
var score;
var level;

// Initialize and start the game
function gameStart() {
  snack = {
    body: [{ x: BLOCK_COUNT / 2, y: BLOCK_COUNT / 2 }],
    size: 5,
    direction: { x: 0, y: -1 }
  };
  
  putApple();
  updateScore(0);
  updateGameLevel(1);
}

// Update the game level and adjust the game speed accordingly
function updateGameLevel(newLevel) {
  level = newLevel;
  
  if (gameInterval) {
    clearInterval(gameInterval);
  }
  gameInterval = setInterval(gameRoutine, 1000 / (10 + level));
}

// Update the displayed score
function updateScore(newScore) {
  score = newScore;
  document.getElementById('score_id').textContent = score;
}

// Place an apple at a random position not occupied by the snack
function putApple() {
  apple = {
    x: Math.floor(Math.random() * BLOCK_COUNT),
    y: Math.floor(Math.random() * BLOCK_COUNT)
  };
  
  // Ensure the apple does not appear on the snack
  for (var i = 0; i < snack.body.length; i++) {
    if (snack.body[i].x === apple.x && snack.body[i].y === apple.y) {
      putApple();
      break;
    }
  }
}

// Handle the event of the snack eating an apple
function eatApple() {
  snack.size += 1;
  putApple();
  updateScore(score + 1);
}

// Main game routine that updates game state
function gameRoutine() {
  moveSnack();
  
  if (snackIsDead()) {
    gameOver();
    return;
  }
  
  if (snack.body[0].x === apple.x && snack.body[0].y === apple.y) {
    eatApple();
  }
  
  updateCanvas();
}

// Check if the snack has collided with the wall or itself
function snackIsDead() {
  // Check for wall collisions
  if (snack.body[0].x < 0 || snack.body[0].x >= BLOCK_COUNT || 
      snack.body[0].y < 0 || snack.body[0].y >= BLOCK_COUNT) {
    return true;
  }
  
  // Check for collisions with itself
  for (var i = 1; i < snack.body.length; i++) {
    if (snack.body[0].x === snack.body[i].x && snack.body[0].y === snack.body[i].y) {
      return true;
    }
  }
  
  return false;
}

// End the game
function gameOver() {
  clearInterval(gameInterval);
}

// Move the snack based on its direction
function moveSnack() {
  var newBlock = {
    x: snack.body[0].x + snack.direction.x,
    y: snack.body[0].y + snack.direction.y
  };
  
  snack.body.unshift(newBlock);
  
  while (snack.body.length > snack.size) {
    snack.body.pop();
  }
}

// Redraw the canvas with the updated game state
function updateCanvas() {
  var context = canvas.getContext('2d');
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw snack
  context.fillStyle = 'lime';
  for (var i = 0; i < snack.body.length; i++) {
    context.fillRect(
      snack.body[i].x * BLOCK_SIZE + 1,
      snack.body[i].y * BLOCK_SIZE + 1,
      BLOCK_SIZE - 1,
      BLOCK_SIZE - 1
    );
  }
  
  // Draw apple
  context.fillStyle = 'red';
  context.fillRect(
    apple.x * BLOCK_SIZE + 1,
    apple.y * BLOCK_SIZE + 1,
    BLOCK_SIZE - 1,
    BLOCK_SIZE - 1
  );
}

// Event listeners for control buttons and keyboard input
window.onload = onPageLoaded;

function onPageLoaded() {
  document.getElementById('btn-left').addEventListener('click', function() {
    rotateSnackLeft();
  });

  document.getElementById('btn-right').addEventListener('click', function() {
    rotateSnackRight();
  });

  document.addEventListener('keydown', handleKeyDown);
}

// Rotate the snack left based on its current direction
function rotateSnackLeft() {
  var originX = snack.direction.x;
  var originY = snack.direction.y;
  snack.direction.x = originY;
  snack.direction.y = -originX;
}

// Rotate the snack right based on its current direction
function rotateSnackRight() {
  var originX = snack.direction.x;
  var originY = snack.direction.y;
  snack.direction.x = -originY;
  snack.direction.y = originX;
}

// Handle keyboard input for snack rotation
function handleKeyDown(event) {
  if (event.keyCode === 37) { // Left arrow key
    rotateSnackLeft();
  } else if (event.keyCode === 39) { // Right arrow key
    rotateSnackRight();
  }
}