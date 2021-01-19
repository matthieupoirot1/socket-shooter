const SPACEBAR = 32;

const serverSocket = io('localhost:23000');

serverSocket.on('connect_error', err => console.log(err));
serverSocket.on('connect_failed', err => console.log(err));

let players = [];
let projectiles = [];
let buffs = [];

function setup() {
  frameRate(60);
  createCanvas(windowWidth, windowHeight);

  serverSocket.on('connect', function() {
    console.log("Connected to server socket !");
  });

  serverSocket.on("heartbeat", (serverElements) => {
    //replace and reconstruct players
    players = serverElements.players.map((serverPlayer) => {
      return new Player(serverPlayer)
    });

    //replace and reconstruct projectiles
    projectiles = serverElements.projectiles.map((serverProjectile)=>{
      return new Projectile(serverProjectile);
    });

    //replace and reconstruct buffs
    buffs = serverElements.buffs.map((serverBuff)=> {
        return new Buff(serverBuff)
    });
  });

  serverSocket.on(
      "disconnect",
      serverSocket.emit('disconnect')
  );
}

function draw() {
  handlePlayerMovement();
  //remove everything
  clear();
  background(220);

  //draw every players
  players.forEach((player) => {
    player.draw()
  });

  //draw every projectiles
  projectiles.forEach((projectile) => {
    projectile.draw()
  });

  //draw every buffs
  buffs.forEach((buff) => {
    buff.draw();
  });
}

function mouseClicked(){
    serverSocket.emit("shoot",{mouseX : mouseX, mouseY: mouseY});
}

function handlePlayerMovement(){
  if (keyIsDown(81)) {
    serverSocket.emit('move',{axis:"-x"});
  }
  if (keyIsDown(68)) {
    serverSocket.emit('move',{axis:"x"});
  }
  if (keyIsDown(90)) {
    serverSocket.emit('move',{axis:"-y"});
  }
  if (keyIsDown(83)) {
    serverSocket.emit('move',{axis:"y"});
  }
}

function removePlayer(playerId) {
  players = players.filter(player => player.id !== playerId);
}
