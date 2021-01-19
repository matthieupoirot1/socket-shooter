const Buff = require("./Buff");
const Player = require("./Player");
const Projectile = require("./Projectile");

class GameRoom{
    constructor(){
        /** @type {Projectile[]}*/
        this.projectiles = [];
        /** @type {Player[]} */
        this.players = [];
        /** @type {Buff[]} */
        this.buffs = [];

        // if first player of server
        this.generateBuffs();
    }

    /**
     * @param playerSocket
     */
    addPlayer(playerSocket){
        let playerId = playerSocket.id;

        //creating and pushing new player
        let clientSocketPlayer = new Player(playerId);
        this.players.push(clientSocketPlayer);
        console.log(`Added new player : ${clientSocketPlayer}`);

        //handling player movement
        playerSocket.on("move", (moveObject)=>{
            clientSocketPlayer.handlePlayerMovement(moveObject)
        });

        //handling player shooting
        playerSocket.on("shoot", (mousePos)=>{
            this.projectiles.push(new Projectile(
                {playerY:clientSocketPlayer.y, playerX:clientSocketPlayer.x},
                mousePos,
                clientSocketPlayer.rgb,
                clientSocketPlayer.id
            ));
        });

        //if client socket is detected as "disconnected
        playerSocket.on("disconnect", () => {
            console.log(`Removing player : ${playerSocket.id}`)
            this.removePlayer(playerSocket.id);
        });
    }

    checkBuffCollision(){
        this.players.forEach((hitPlayer)=>{
           this.buffs.forEach((buff)=>{
               let testX = hitPlayer.x;
               let testY = hitPlayer.y;
               if (hitPlayer.x < buff.x) testX = buff.x;
               else if (hitPlayer.x > buff.x+15) testX = buff.x+5;

               if (hitPlayer.y < buff.y) testY = buff.y;
               else if (hitPlayer.y > buff.y+15) testY = buff.y+15;

               let distX = hitPlayer.x-testX;
               let distY = hitPlayer.y-testY;
               let distance = Math.sqrt( (distX*distX) + (distY*distY) );
               if (distance <= 10) {
                   switch(buff.type){
                       case 1:
                        hitPlayer.damages +=5;
                        break;
                        //TODO do case 2 and 3 (green and blue)
                   }
                   this.buffs = this.buffs.filter((comparedBuff) => comparedBuff !== buff);
               }
           });
        });
    }

    checkBulletCollisions(){
        this.players.forEach((hitPlayer)=>{
            this.projectiles.forEach((projectile)=>{
                if(hitPlayer.id !== projectile.ownerId) {
                    let deltaXsquared = Math.pow(hitPlayer.x - projectile.x, 2);
                    let deltaYSquared = Math.pow(hitPlayer.y - projectile.y, 2);
                    let sumRadiiSquared = Math.pow(20 + 5, 2);
                    if (deltaXsquared + deltaYSquared <= sumRadiiSquared) {
                        let winner = this.players.find((player)=>{
                            return player.id === projectile.ownerId;
                        });
                        hitPlayer.hp -= winner.damages;
                        this.projectiles = this.projectiles.filter((comparedProj) => comparedProj !== projectile);
                        if(hitPlayer.hp<=0){
                            this.handleDeath(hitPlayer,projectile);
                        }
                    }
                }
            });
        });
    }

    /**
     * Method handling death of player from a projectile
     * @param {Player} hitPlayer Dead player
     * @param {Projectile} projectile
     */
    handleDeath(hitPlayer, projectile) {
        // Increment winning player score
        let winner = this.players.find((player)=>{
            return player.id === projectile.ownerId;
        });

        winner.score += 1;
        hitPlayer.reset();
    }

    generateBuffs() {
        setInterval(()=>{
            console.log("hey adding new buff!")
            this.buffs.push(new Buff());
        }, 5000)
    }

    removePlayer(playerId){
        this.players = this.players.filter(player => player.id !== playerId);
    }

    removeEphemeralObjects(){
        let time = Date.now();
        this.projectiles = this.projectiles.filter((projectileToRemove) => {
            return time - projectileToRemove.creation < 5000
        });
        this.buffs = this.buffs.filter((buffToRemove) => {
            return time - buffToRemove.creation < 5000
        });
    }
}

module.exports = GameRoom;