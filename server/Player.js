
class Player {
  constructor(socketId) {
    /** @type {number} */
    this.hp = 100;
    /** @type {number} */
    this.x = Math.random() * 400 + 1;
    /** @type {number} */
    this.y = Math.random() * 400 + 1;
    /** @type {string} */
    this.id = socketId;
    /** @type {{r: number, b: number, g: number}}*/
    this.rgb = {
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255,
    }
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
}

module.exports = Player;