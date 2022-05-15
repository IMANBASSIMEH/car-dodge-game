var canvas = document.querySelector('canvas')
var ctx = canvas.getContext('2d')
canvas.width = canvas.height = 750

var keys = {}
var score = 0
var scoreFinder = 0
let isGameEnd = false;

window.addEventListener('keydown', function (e) {
  keys[e.keyCode] = true
  e.preventDefault()
})

window.addEventListener('keyup', function (e) {
  delete keys[e.keyCode]
})

// class Box {}

function Box(options) {
  this.x = options.x || 10
  this.y = options.y || 10
  this.width = options.width || 40
  this.height = options.height || 50
  this.color = options.color || '#000000'
  this.speed = options.speed || 5
  this.direction = options.direction || 'right'
  this.safeSpace = options.safeSpace || 5
}

let obstacles = [
  new Box({
    x: canvas.width / 4,
    y: 0,
    width: 50,
    height: 80,
    color: 'tomato',
    speed: 2,
    safeSpace: 5,
  }),
  new Box({
    x: canvas.width / 4,
    y: 0,
    width: 50,
    height: 80,
    color: 'tomato',
    speed: 2,
    safeSpace: 5,
  }),
  new Box({
    x: canvas.width / 4,
    y: 0,
    width: 50,
    height: 80,
    color: 'tomato',
    speed: 2,
    safeSpace: 5,
  }),
  new Box({
    x: canvas.width / 4,
    y: 0,
    width: 50,
    height: 80,
    color: 'tomato',
    speed: 2,
    safeSpace: 5,
  }),
  new Box({
    x: canvas.width / 4,
    y: 0,
    width: 50,
    height: 80,
    color: 'tomato',
    speed: 2,
    safeSpace: 5,
  }),
  new Box({
    x: canvas.width / 4,
    y: 0,
    width: 50,
    height: 80,
    color: 'tomato',
    speed: 2,
    safeSpace: 5,
  }),
]

var player = new Box({
  x: canvas.width / 2,
  y: canvas.height - 100,
  width: 55,
  height: 80,
  color: '#44ee11',
  speed: 5,
  safeSpace: 5,
})

function input(player) {
  if (37 in keys || 65 in keys) {
    player.x -= player.speed
    player.direction = 'left'
  }
  if (39 in keys || 68 in keys) {
    player.x += player.speed
    player.direction = 'right'
  }
  if ((38 in keys || 87 in keys) && false) {
    player.y -= player.speed
    player.direction = 'up'
  }
  if ((40 in keys || 83 in keys) && false) {
    player.y += player.speed
    player.direction = 'down'
  }
  limitControl(player)
}

function drawBox(box) {
  var img = new Image()
  img.src = 'img/player_car.png'
  ctx.drawImage(img, box.x, box.y, box.width, box.height)
}

function drawObstacle(obstacles) {
  var img = new Image()
  img.src = 'img/obstacle_car.png'
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].x = (canvas.width / (obstacles.length + 1)) * (i + 1)
    ctx.drawImage(
      img,
      obstacles[i].x,
      obstacles[i].y,
      obstacles[i].width,
      obstacles[i].height
    )
  }
}

function moveObstacles() {
  let max = 1000
  let min = 200
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].y += obstacles[i].speed
    let rand = Math.floor(Math.random() * (max - min)) + min
    if (
      obstacles[i].y >=
      canvas.height - obstacles[i].safeSpace - obstacles[i].height + rand
    ) {
      obstacles[i].y = obstacles[i].safeSpace
      initSpeed()
    }
  }
}

function update() {
  input(player)
  moveObstacles()
}
function draw() {
  var img = new Image()
  img.src = 'img/road.jpg'
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  ctx.font = '30px Arial'
  ctx.fillStyle = 'red'
  ctx.textAlign = 'right'
  ctx.fillText('Score : ' + score, 700, 50)
  drawBox(player)
  drawObstacle(obstacles)
}

function limitControl(player) {
  if (player.x <= player.safeSpace + player.width) {
    player.x = player.safeSpace + player.width
  }
  if (player.y <= player.safeSpace) {
    player.y = player.safeSpace
  }
  if (player.x >= canvas.width - player.width - player.safeSpace) {
    player.x = canvas.width - player.width - player.safeSpace
  }
  if (player.y >= canvas.height - player.height - player.safeSpace) {
    player.y = canvas.height - player.height - player.safeSpace
  }
}

function initSpeed() {
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].speed = Math.floor(Math.random() * (8 - 3)) + 3
  }
}

function checkCollision(i) {
  let foo = false
  if (
    obstacles[i].x + obstacles[i].width >= player.x &&
    obstacles[i].x <= player.x + player.width &&
    obstacles[i].y + obstacles[i].height >= player.y &&
    obstacles[i].y <= player.y + player.height
  )
    foo = true
  return foo
}

function resetGame() {
  isGameEnd = false;
  let rand = Math.floor(Math.random() * (obstacles.length - 1)) + 1
  player.x = (canvas.width / (obstacles.length + 1)) * (rand + 1)
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].y = obstacles[i].safeSpace
  }
  score = 0
}

function printScore() {
  isGameEnd = true
  console.log('🎉🎉', score)

  const modal = document.querySelector('.modal')
  document.querySelector('.modal div span').innerHTML = score
  const btn = document
    .querySelector('.modal div button')
    .addEventListener('click', () => {
      resetGame()
      modal.style.display = 'none'
    })

  modal.style.display = 'grid'
}

function incrementScore() {
  scoreFinder += 1
  if (scoreFinder === 30) {
    scoreFinder = 0
    score += 1
  }
}

let id

function loop() {
  if (!isGameEnd) {
    update()
    draw()
    incrementScore()
    for (let i = 0; i < obstacles.length; i++) {
      if (checkCollision(i)) {
        printScore()
        break
      }
    }
  }else{
    initSpeed()
  }
  id = window.requestAnimationFrame(loop)
}

initSpeed()
loop()
