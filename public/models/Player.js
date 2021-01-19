class Player {

  /**
   * @param {object} player Client Player object
   * @param {number} player.x Player x axis position
   * @param {number} player.hp Player x axis position
   * @param {number} player.y Player y axis position
   * @param {string} player.id player id
   * @param {object} player.rgb Player rgb values object
   * @param {number} player.rgb.r Player red value
   * @param {number} player.rgb.g Player green value
   * @param {number} player.rgb.b Player blue value
   * @param {number} player.score Player score
   */
  constructor(player) {
    this.hp = player.hp;
    this.x = player.x;
    this.y = player.y;
    this.id = player.id;
    this.rgb = player.rgb;
    this.score = player.score;
  }

  draw() {
    fill(this.rgb.r, this.rgb.g, this.rgb.b);
    circle(this.x, this.y, 20);
    this.drawHealthBar();
  }

  drawHealthBar(){
    if (this.hp < 25)
    {
      fill(255, 0, 0);
    }
    else if (this.hp < 50)
    {
      fill(255, 200, 0);
    }
    else
    {
      fill(0, 255, 0);
    }

    let xPos = this.x - 26;
    let yPos = this.y - 30;

    let barHeight = 5;
    let maxBarWidth = 50;

    noStroke();
    // Get fraction 0->1 and multiply it by width of bar
    let drawWidth = (this.hp / 100) * maxBarWidth;

    if(this.hp>0) {
      rect(xPos, yPos, drawWidth, barHeight);
    }

    // Outline
    stroke(0);
    noFill();
    rect(xPos, yPos, maxBarWidth, barHeight);

    let textXPos = xPos+maxBarWidth + 5;
    let textYPos = yPos + barHeight;
    text(this.score, textXPos, textYPos);
  }
}