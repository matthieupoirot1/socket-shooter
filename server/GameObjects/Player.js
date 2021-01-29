const Projectile =require('./Projectile');

class Player {
  constructor(clientSocket, gameRoom) {
    /** @type {number} */
    this.hp = 100;
    /** @type {number} */
    this.x = Math.random() * 400 + 1;
    /** @type {number} */
    this.y = Math.random() * 400 + 1;
    /** @type {string} */
    this.socket = clientSocket;
    /** @type {{r: number, b: number, g: number}}*/
    this.rgb = {
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255,
    }
    this.score = 0;
    this.damages = 10;
    this.gameRoom = gameRoom;

    //handling player movement
    this.socket.on("move", (moveObject)=>{
      this.handlePlayerMovement(moveObject)
    });

    //handling player shooting
    this.socket.on("shoot", (mousePos)=>{
      gameRoom.projectiles.push(new Projectile(
          {playerY:this.y, playerX:this.x},
          mousePos,
          this.rgb,
          this.socket.id
      ));
    });

    //if client socket is detected as "disconnected
    this.socket.on("disconnect", () => {
      console.log(`Removing player with socketId : ${this.socket.id}`)
      gameRoom.removePlayer(this);
    });
  }

  /**
   * Listener to handle "move" event received from server
   * @param moveObject "move" event information received through client socket
   * @param {string} moveObject.axis axis received to increase corresponding position
   */
  handlePlayerMovement(moveObject) {
    switch (moveObject.axis) {
      case "x":
        this.x += 5;
        break;
      case "-x":
        this.x -= 5;
        break;
      case "y":
        this.y += 5;
        break;
      case "-y":
        this.y -= 5;
        break;
    }
  }

  reset(){
    // reset dead player
    this.hp = 100;
    this.x = Math.random() * 400 + 1;
    this.y = Math.random() * 400 + 1;
    this.damages = 10;
  }

  /**
   * Method handling death of player from a projectile
   * @param {Projectile} projectile
   */
  handleDeath(projectile) {
    // Increment winning player score
    let winner = this.gameRoom.players.find((player)=>{
      return player.socket.id === projectile.ownerId;
    });

    winner.score += 1;
    this.reset();
  }

  serverInfos = ()=>{
    return {
      x:this.x,
      y:this.y,
      hp:this.hp,
      rgb:this.rgb,
      score:this.score,
      damages:this.damages
    }
  }
}

module.exports = Player;