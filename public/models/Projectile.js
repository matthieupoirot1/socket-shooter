class Projectile {

    /**
     * @param {object} projectile Client Projectile object
     * @param {number} projectile.x Projectile x axis position
     * @param {number} projectile.y Projectile y axis position
     * @param {string} projectile.id Projectile id
     * @param {object} projectile.rgb Projectile rgb values object
     * @param {number} projectile.rgb.r Projectile red value
     * @param {number} projectile.rgb.g Projectile green value
     * @param {number} projectile.rgb.b Projectile blue value
     */
    constructor(projectile) {

        this.x = projectile.x;
        this.y = projectile.y;
        this.id = projectile.id;
        this.rgb = projectile.rgb;
    }


    draw() {
        fill(this.rgb.r, this.rgb.g, this.rgb.b);
        circle(this.x, this.y, 5);
    }

}