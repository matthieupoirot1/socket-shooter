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
            console.log("moving")
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

        // if first player of server
        if(this.players.length === 1){
            this.generateBuffs();
        }
    }

    checkBulletCollisions(){
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

    generateBuffs() {
        setInterval(()=>{
            console.log("hey adding new buff!")
            this.buffs.push(new Buff());
        }, 5000)
    }

    removePlayer(collection, playerId){
        this.players = this.players.filter(player => player.id !== playerId);
    }

    removeEphemeralObjects(){
        let time = Date.now();
        this.projectiles = this.projectiles.filter((projectileToRemove) => {
            console.log("removing projectile");
            return time - projectileToRemove.creation < 5000
        });
        this.buffs = this.buffs.filter((buffToRemove) => {
            return time - buffToRemove.creation < 5000
        });
    }
}

module.exports = GameRoom;