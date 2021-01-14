class Buff {

    /**
     * @param {object} buff Client Buff object
     * @param {number} buff.x Buff x axis position
     * @param {number} buff.y Buff y axis position
     * @param {object} buff.rgb Buff rgb values object
     * @param {number} buff.rgb.r Buff red value
     * @param {number} buff.rgb.g Buff green value
     * @param {number} buff.rgb.b Buff blue value
     */
    constructor(buff) {

        this.x = buff.x;
        this.y = buff.y;
        this.rgb = buff.rgb;
    }

    draw() {
        fill(this.rgb.r, this.rgb.g, this.rgb.b);
        square(this.x, this.y, 15);
    }
}