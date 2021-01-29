const Player = require("./GameObjects/Player");
const Projectile = require("./GameObjects/Projectile");
const Buff = require("./GameObjects/Buff");

class GameRoom{
    constructor(ioServer){
        this.ioServer = ioServer;
        /** @type {Projectile[]}*/
        this.projectiles = [];
        /** @type {Player[]} */
        this.players = [];
        /** @type {Buff[]} */
        this.buffs = [];

        this.generateBuffs();
        setInterval(this.updateGame, 16);
    }

    createPlayer = (clientSocket) => {
        //creating and pushing new player
        let clientSocketPlayer = new Player(clientSocket, this);
        this.players.push(clientSocketPlayer);
        console.log(`Added new player : ${clientSocketPlayer}`);
    }

    checkBuffCollision = () => {
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

    checkBulletCollisions = () => {
        this.players.forEach((hitPlayer)=>{
            this.projectiles.forEach((projectile)=>{
                if(hitPlayer.socket.id !== projectile.ownerId) {
                    let deltaXsquared = Math.pow(hitPlayer.x - projectile.x, 2);
                    let deltaYSquared = Math.pow(hitPlayer.y - projectile.y, 2);
                    let sumRadiiSquared = Math.pow(20 + 5, 2);
                    if (deltaXsquared + deltaYSquared <= sumRadiiSquared) {
                        let winner = this.players.find((player)=>{
                            return player.socket.id === projectile.ownerId;
                        });
                        //TODO bug : winner undefined
                        hitPlayer.hp -= winner.damages;
                        this.projectiles = this.projectiles.filter((comparedProj) => comparedProj !== projectile);
                        if(hitPlayer.hp<=0){
                            hitPlayer.handleDeath(projectile);
                        }
                    }
                }
            });
        });
    }

    generateBuffs = () => {
        setInterval(()=>{
            console.log("hey adding new buff!")
            this.buffs.push(new Buff());
        }, 5000)
    }

    removePlayer = (player) => {
        this.players = this.players.filter(comparedPlayer => comparedPlayer !== player);
    }

    removeEphemeralObjects = () => {
        let time = Date.now();
        this.projectiles = this.projectiles.filter((projectileToRemove) => {
            return time - projectileToRemove.creation < 5000
        });
        this.buffs = this.buffs.filter((buffToRemove) => {
            return time - buffToRemove.creation < 5000
        });
    }

    updateGame = () => {
        //TODO : bullet collisions not working
        this.checkBulletCollisions();
        this.checkBuffCollision();
        this.removeEphemeralObjects();

        this.ioServer.sockets.emit(
            "heartbeat",
            {
                players:this.players.map((player)=>player.serverInfos()),
                projectiles:this.projectiles,
                buffs:this.buffs
            }
        );
    }

    isFull(){
        //TODO implement several gameRooms
        return false;
    }
}

module.exports = GameRoom;