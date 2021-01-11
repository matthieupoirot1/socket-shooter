const socket = io.connect('localhost:23000');
const SPACEBAR = 32;

let players = [];
let projectiles = [];

socket.on("heartbeat", (serverElements) => {
  players = serverElements.players.map((serverPlayer) => new Player(serverPlayer));
  projectiles = serverElements.projectiles.map((serverProjectile)=> new Projectile(serverProjectile));
  console.log(projectiles);
});

socket.on("disconnect", playerId => removePlayer(playerId));

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  handlePlayerMovement();
  clear();
  background(220);
  players.forEach(player => player.draw());
  projectiles.forEach(projectile => projectile.draw());
}

function mouseClicked(){
    socket.emit("shoot",{mouseX : mouseX, mouseY: mouseY});
}

function handlePlayerMovement(){
  if (keyIsDown(81)) {
    socket.emit('move',{axis:"-x"});
  }
  if (keyIsDown(68)) {
    socket.emit('move',{axis:"x"});
  }
  if (keyIsDown(90)) {
    socket.emit('move',{axis:"-y"});
  }
  if (keyIsDown(83)) {
    socket.emit('move',{axis:"y"});
  }
}

function removePlayer(playerId) {
  players = players.filter(player => player.id !== playerId);
}
