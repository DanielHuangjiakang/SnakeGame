// 确定 canvas 的大小以匹配屏幕元素
var canvas = document.getElementById('canvas_id');
var screen = document.querySelector('.screen');
// 获取屏幕的计算后的宽度和高度，减去边框
var computedStyle = getComputedStyle(screen);
var screenWidth = parseInt(computedStyle.width);
var screenHeight = parseInt(computedStyle.height);

// 设置 canvas 元素的实际宽度和高度属性
canvas.width = screenWidth;
canvas.height = screenHeight;

// 根据新的 canvas 尺寸更新游戏逻辑中的块大小和块数量
var BLOCK_SIZE = screenWidth / 20; // 例如，如果你想要20个块的网格
var BLOCK_COUNT = 20;

var gameInterval
var snack
var apple
var score
var level

function gameStart() {
  snack = {
    body: [
      { x: BLOCK_COUNT / 2, y: BLOCK_COUNT / 2 }
    ],
    size: 5,
    direction: { x: 0, y: -1 }
  }
  
  putApple()
  updateScore(0)
  updateGameLevel(1)
}

function updateGameLevel(newLevel) {
  level = newLevel
  
  if (gameInterval) {
    clearInterval(gameInterval)
  }
  gameInterval = setInterval(gameRoutine, 1000 / (10 + level))
}

function updateScore(newScore) {
  score = newScore
  document.getElementById('score_id').innerHTML = score
}

function putApple() {
  apple = {
    x: Math.floor(Math.random() * BLOCK_COUNT),
    y: Math.floor(Math.random() * BLOCK_COUNT)
  }
  
  for (var i=0; i<snack.body.length; i++) {
    if (snack.body[i].x === apple.x &&
        snack.body[i].y === apple.y) {
      putApple()
      break
    }
  }
}

function eatApple() {
  snack.size += 1
  putApple()
  updateScore(score + 1)
}

function gameRoutine() {
  moveSnack()
  
  if (snackIsDead()) {
    gameOver()
    return
  }
  
  if (snack.body[0].x === apple.x &&
      snack.body[0].y === apple.y) {
    eatApple()
  }
  
  updateCanvas()
}

function snackIsDead() {
  // hit walls
  if (snack.body[0].x < 0) {
    return true
  } else if (snack.body[0].x >= BLOCK_COUNT) {
    return true
  } else if (snack.body[0].y < 0) {
    return true
  } else if (snack.body[0].y >= BLOCK_COUNT) {
    return true
  }
  
  // hit body
  for (var i=1; i<snack.body.length; i++) {
    if (snack.body[0].x === snack.body[i].x &&
        snack.body[0].y === snack.body[i].y) {
      return true
    }
  }
  
  return false
}

function gameOver() {
  clearInterval(gameInterval)
}

function moveSnack() {
  var newBlock = {
    x: snack.body[0].x + snack.direction.x,
    y: snack.body[0].y + snack.direction.y
  }
  
  snack.body.unshift(newBlock)
  
  while (snack.body.length > snack.size) {
    snack.body.pop()
  }
}

function updateCanvas() {
  var canvas = document.getElementById('canvas_id')
  var context = canvas.getContext('2d')
  
  context.fillStyle = 'black'
  context.fillRect(0, 0, canvas.width, canvas.height)
  
  context.fillStyle = 'lime'
  for (var i=0; i<snack.body.length; i++) {
    context.fillRect(
      snack.body[i].x * BLOCK_SIZE + 1,
      snack.body[i].y * BLOCK_SIZE + 1,
      BLOCK_SIZE - 1,
      BLOCK_SIZE - 1
    )
  }
  
  context.fillStyle = 'red'
  context.fillRect(
    apple.x * BLOCK_SIZE + 1,
    apple.y * BLOCK_SIZE + 1,
    BLOCK_SIZE - 1,
    BLOCK_SIZE - 1
  )
}

window.onload = onPageLoaded

function onPageLoaded() {
    // // Attach event listeners to buttons
    // document.getElementById('btn-left').addEventListener('click', function() {
    //     var originX = snack.direction.x
    //     var originY = snack.direction.y
    //     if (snack.direction.y !== 0) { // Prevents the snake from reversing on itself
    //         snack.direction.x = originY
    //         snack.direction.y = -originX
    //     }
    // });

    // document.getElementById('btn-right').addEventListener('click', function() {
    //     var originX = snack.direction.x
    //     var originY = snack.direction.y
    //     if (snack.direction.y !== 0) { // Prevents the snake from reversing on itself
    //         snack.direction.x = -originY
    //         snack.direction.y = originX
    //     }
    // });
    document.addEventListener('keydown', handleKeyDown);
}


function handleKeyDown(event) {
  var originX = snack.direction.x
  var originY = snack.direction.y
  
  if (event.keyCode === 37) { // 左键
    snack.direction.x = originY
    snack.direction.y = -originX
  } else if (event.keyCode === 39) { // 右键
    snack.direction.x = -originY
    snack.direction.y = originX
  }
}



