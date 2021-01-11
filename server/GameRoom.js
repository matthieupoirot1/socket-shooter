const Player = require("./Player");
const Projectile = require("./Projectile");

class GameRoom{
    constructor(){
        /** @type {Projectile[]}*/
        this.projectiles = [];
        /** @type {Player[]} */
        this.players = [];
    }

    addPlayer(playerSocket){
        let playerId = playerSocket.id;
        //creating and pushing new player
        let clientSocketPlayer = new Player(playerId);
        console.log(clientSocketPlayer);
        this.players.push(clientSocketPlayer);
        console.log("pushing new player :");
        playerSocket.on("move", (moveObject)=>{
            clientSocketPlayer.handlePlayerMovement(moveObject)
        });

        playerSocket.on("shoot", (mousePos)=>{
            this.projectiles.push(new Projectile({playerY:clientSocketPlayer.y, playerX:clientSocketPlayer.x}, mousePos, clientSocketPlayer.rgb, clientSocketPlayer.id));
        });

        //TODO calculate direction and movement of projectile on server

        //if client socket is detected as "disconnected
        playerSocket.on("disconnect", () => {
            //update server's players list
            this.players = this.players.filter(player => player.id !== playerSocket.id);
        });
    }

    checkCollisions(){
        this.players.forEach((player)=>{
            this.projectiles.forEach((projectile)=>{
                if(player.id !== projectile.ownerId) {
                    let deltaXsquared = Math.pow(player.x - projectile.x, 2);
                    let deltaYSquared = Math.pow(player.y - projectile.y, 2);
                    let sumRadiiSquared = Math.pow(20 + 5, 2);
                    if (deltaXsquared + deltaYSquared <= sumRadiiSquared) {
                        player.hp -= 10;
                        this.projectiles = this.projectiles.filter((comparedProj) => comparedProj !== projectile);
                    }
                }
            });
        });
    }

    getPlayers(){
        return this.players;
    }
    getProjectiles(){
        return this.projectiles;
    }
}

module.exports = GameRoom;