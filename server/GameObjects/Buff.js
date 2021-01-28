
class Buff {
    constructor() {
        /** @type {number} */
        this.type = Math.floor(Math.random()*4)+1;
        /** @type {number} */
        this.x = Math.random() * 400 + 1;
        /** @type {number} */
        this.y = Math.random() * 400 + 1;

        //choose color from type
        if(this.type === 1){
            /** @type {{r: number, b: number, g: number}}*/
            this.rgb = {
                r: 255,
                g: 0,
                b: 0,
            };
        }else if (this.type === 2){
            this.rgb = {
                r: 0,
                g: 255,
                b: 0,
            };
        }else{
            this.rgb = {
                r: 0,
                g: 0,
                b: 255,
            };
        }

        //calculate lifetime of object in seconds
        this.creation = Date.now();
    }
}

module.exports = Buff;