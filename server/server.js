const express = require("express");
const socket = require('socket.io');
const app = express();
const Player = require("./Player");
const GameRoom = require("./GameRoom");

let server = app.listen(23000);
console.log('The server is now running at http://localhost:23000');
app.use(express.static("public"));

let io = socket(server);

let gameRoom = new GameRoom();

setInterval(updateGame, 16);

io.sockets.on("connection", socket => {
    console.log(`New connection ${socket.id}`);
    gameRoom.addPlayer(socket);
    console.log(`Number of players  : ${gameRoom.players.length}`);
});

//TODO determine if useful to intercept from server
io.sockets.on("disconnect", socket => {
  io.sockets.emit(
      "disconnect",
      socket.id
  );
  gameRoom.players = gameRoom.players.filter(player => player.id !== socket.id);
});

function updateGame() {
    gameRoom.checkBulletCollisions();
    gameRoom.checkBuffCollision();
    gameRoom.removeEphemeralObjects();
    io.sockets.emit(
        "heartbeat",
        {
            players:gameRoom.players,
            projectiles:gameRoom.projectiles,
            buffs:gameRoom.buffs
        }
    );
}




