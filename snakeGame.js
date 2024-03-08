var BLOCK_SIZE = 20
var BLOCK_COUNT = 20

var gameInterval
var snack

window.onload = onPageLoad
function onPageLoad() {
    document.addEventListener("keydown", handleKeyDown)
}

function gameStart() {
    snack = {
        body: [{ x: BLOCK_COUNT / 2, y: BLOCK_COUNT / 2 }],
        size: 5,
        direction: { x: 0, y: -1}
      }

    gameInterval = setInterval(gameRoutine, 100)
}

function gameRoutine() {
    moveSnack()

    updateCanvas()
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
}

