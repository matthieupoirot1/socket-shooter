class Projectile {
    /**
     * Projectile Object
     * @param {object} playerPos
     * @param {object} mousePos
     * @param {Object} rgb
     * @param {string} ownerId
     */
    constructor(playerPos, mousePos, rgb, ownerId) {
        this.ownerId = ownerId;
        this.rgb = rgb;

        //calculate movement
        this.direction = {};
        this.direction.x = mousePos.mouseX - playerPos.playerX;
        this.direction.y = mousePos.mouseY - playerPos.playerY;
        let length = Math.sqrt( this.direction.x*this.direction.x + this.direction.y*this.direction.y);
        this.direction.x/=length;
        this.direction.y/=length;

        this.x = playerPos.playerX + this.direction.x*26;
        this.y = playerPos.playerY+ this.direction.y*26;
        setInterval(()=>{
            this.moveBullet();
        }, 15)

        //calculate lifetime of object in seconds
        this.creation = Date.now();
    }

    moveBullet(){
        this.x += this.direction.x*5;
        this.y += this.direction.y*5;
    }
}

module.exports = Projectile;